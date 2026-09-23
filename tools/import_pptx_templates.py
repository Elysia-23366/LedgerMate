#!/usr/bin/env python3
"""Import local PPTX decks as offline artwork plates with editable text overlays.

Usage: python import_pptx_templates.py ID SOURCE.pptx DISPLAY_NAME
The script keeps the original PPTX, builds text-free slide plates, and writes
PPTImportedLibrary/PPTTemplateAssets JavaScript files for the local web app.
"""
import base64
import json
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from lxml import etree
from PIL import Image
from pptx import Presentation
from pptx.enum.dml import MSO_COLOR_TYPE
from pptx.enum.shapes import MSO_SHAPE_TYPE

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "user-templates"
SOFFICE = shutil.which("soffice")
PDFTOPPM = shutil.which("pdftoppm")
EMU = 914400
NS = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main"}


def px(emu, total, limit):
    return round(float(emu) / float(total) * limit, 2)


def source_text(text):
    return re.sub(r"\s+", " ", text or "").strip()


def display_text(text):
    s = source_text(text)
    if re.search(r"飞书|Feishu|成就顶级分布式团队|2025|失眠啵啵|模板作者|模板来源|版权|版权所有|公众号|扫码", s, re.I):
        return "演示文稿" if len(s) <= 15 else "请根据主题填写内容"
    if re.search(r"描述相关的信息|单击此处输入|现在就开始打字|写任何你想表达|请在此处输入|文字是您思想|文本占位", s):
        return "请补充相关内容"
    if re.search(r"(^|\s)(Lorem|ipsum)(\s|$)", s, re.I):
        return "请补充相关内容"
    return s


def color_of(shape, paragraph, run):
    for font in [getattr(run, "font", None), getattr(paragraph, "font", None)]:
        if font is None:
            continue
        try:
            c = font.color
            if c and c.type == MSO_COLOR_TYPE.RGB and c.rgb:
                return "#" + str(c.rgb)
        except (AttributeError, ValueError):
            pass
    # The source's shape can carry explicit scheme colors in its XML.
    try:
        nodes = shape._element.xpath(".//a:rPr/a:solidFill/a:srgbClr | .//a:defRPr/a:solidFill/a:srgbClr | .//a:endParaRPr/a:solidFill/a:srgbClr")
        if nodes:
            return "#" + nodes[0].get("val")
    except (AttributeError, TypeError):
        pass
    return "#222222"


def text_elements(shapes, width, height, transform=None):
    result = []
    for shape in shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
            # Children have group-local EMU coordinates. Rebase to the slide.
            gx, gy, gw, gh = shape.left, shape.top, shape.width, shape.height
            try:
                offx, offy = shape._element.grpSpPr.xfrm.chOff.x, shape._element.grpSpPr.xfrm.chOff.y
                extx, exty = shape._element.grpSpPr.xfrm.chExt.cx, shape._element.grpSpPr.xfrm.chExt.cy
            except (AttributeError, ZeroDivisionError):
                offx = offy = 0
                extx, exty = gw, gh
            sx, sy = gw / (extx or gw or 1), gh / (exty or gh or 1)
            if transform:
                ox, oy, psx, psy = transform
                child_transform = (ox + (gx - offx) * psx, oy + (gy - offy) * psy, psx * sx, psy * sy)
            else:
                child_transform = (gx - offx * sx, gy - offy * sy, sx, sy)
            result.extend(text_elements(shape.shapes, width, height, child_transform))
            continue
        if not shape.has_text_frame or not shape.text.strip():
            continue
        text = source_text(shape.text)
        if not text:
            continue
        paragraph = next((p for p in shape.text_frame.paragraphs if p.text.strip()), None)
        run = next((r for r in paragraph.runs if r.text.strip()), None) if paragraph else None
        font = run.font if run else (paragraph.font if paragraph else None)
        try:
            size = (font.size.pt if font and font.size else None) or (paragraph.font.size.pt if paragraph and paragraph.font.size else None)
        except (AttributeError, ValueError):
            size = None
        if size is None:
            # Inherited styles are common in placeholders; inspect XML fallback.
            nodes = shape._element.xpath(".//a:rPr[@sz] | .//a:defRPr[@sz] | .//a:endParaRPr[@sz]")
            size = (int(nodes[0].get("sz")) / 100) if nodes else 18
        try:
            fontname = (font.name if font else None) or "Microsoft YaHei"
            bold = bool(font.bold) if font else False
        except (AttributeError, ValueError):
            fontname, bold = "Microsoft YaHei", False
        if transform:
            ox, oy, sx, sy = transform
            left, top = ox + shape.left * sx, oy + shape.top * sy
            sw, sh = shape.width * sx, shape.height * sy
        else:
            left, top, sw, sh = shape.left, shape.top, shape.width, shape.height
        x, y = px(left, width, 1280), px(top, height, 720)
        w, h = max(6, px(sw, width, 1280)), max(8, px(sh, height, 720))
        if x >= 1280 or y >= 720 or x + w <= 0 or y + h <= 0:
            continue
        align = str(paragraph.alignment if paragraph else "").lower()
        align = "center" if "center" in align else "right" if "right" in align else "left"
        color = color_of(shape, paragraph, run)
        result.append({
            "text": display_text(text), "originalText": text,
            "x": x, "y": y, "w": w, "h": h,
            "size": round(float(size) * 4 / 3, 2), "color": color,
            "weight": 700 if bold else 400, "align": align,
            "rotate": round(float(shape.rotation or 0), 2),
            "font": fontname, "anchor": "ctr" if "MIDDLE" in str(shape.text_frame.vertical_anchor) else "t",
            "source": "textbox"
        })
    return result


def scrub_pptx(source, target):
    with zipfile.ZipFile(source) as zin, zipfile.ZipFile(target, "w") as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if re.fullmatch(r"ppt/slides/slide\d+\.xml", item.filename):
                root = etree.fromstring(data)
                for node in root.xpath(".//a:t", namespaces=NS):
                    node.text = ""
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
            zout.writestr(item, data)


def main(template_id, source, name):
    if not SOFFICE or not PDFTOPPM:
        raise SystemExit("Install LibreOffice and Poppler (soffice, pdftoppm) before importing PPTX files.")
    source = Path(source)
    if not source.is_file():
        raise SystemExit(f"Source missing: {source}")
    OUT.mkdir(parents=True, exist_ok=True)
    presentation = Presentation(source)
    pages = []
    for i, slide in enumerate(presentation.slides, 1):
        pages.append({"number": i, "elements": text_elements(slide.shapes, presentation.slide_width, presentation.slide_height), "charts": [], "asset": f"template:{template_id}/{i}"})
    with tempfile.TemporaryDirectory(prefix=f"ppt-{template_id}-") as tmp:
        tmp = Path(tmp)
        stripped = tmp / f"{template_id}.pptx"
        scrub_pptx(source, stripped)
        profile = tmp / "lo-profile"
        cmd = [SOFFICE, "-env:UserInstallation=" + profile.as_uri(), "--headless", "--convert-to", "pdf", "--outdir", str(tmp), str(stripped)]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300)
        pdf = tmp / f"{template_id}.pdf"
        if not pdf.is_file():
            raise RuntimeError(f"LibreOffice did not render {template_id}")
        subprocess.run([PDFTOPPM, "-jpeg", "-r", "96", "-scale-to-x", "1280", "-scale-to-y", "720", "-jpegopt", "quality=87,optimize=y", str(pdf), str(tmp / "plate")], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300)
        jpgs = sorted(tmp.glob("plate-*.jpg"))
        if len(jpgs) != len(pages):
            raise RuntimeError(f"Rendered {len(jpgs)} plates for {len(pages)} pages: {template_id}")
        assets = {}
        for i, jpg in enumerate(jpgs, 1):
            with Image.open(jpg) as im:
                if im.size != (1280, 720):
                    raise RuntimeError(f"Unexpected rendered size: {im.size}")
            assets[f"template:{template_id}/{i}"] = "data:image/jpeg;base64," + base64.b64encode(jpg.read_bytes()).decode("ascii")
    (OUT / f"{template_id}-assets.js").write_text("Object.assign(window.PPTTemplateAssets||(window.PPTTemplateAssets={})," + json.dumps(assets, ensure_ascii=False, separators=(",", ":")) + ");\n", encoding="utf-8")
    (OUT / f"{template_id}-pages.js").write_text("window.PPTImportedLibrary=window.PPTImportedLibrary||{};window.PPTImportedLibrary[" + json.dumps(template_id) + "]=" + json.dumps({"id": template_id, "name": name, "pages": pages}, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    shutil.copy2(source, OUT / f"{name}-原始模板.pptx")
    print(template_id, len(pages), "pages", sum(len(p["elements"]) for p in pages), "editable text layers")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    main(*sys.argv[1:])
