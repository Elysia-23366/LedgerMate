import json, pathlib, xml.etree.ElementTree as ET
base=pathlib.Path(__file__).resolve().parents[2]
root=base/'vendor/ppt-master/presentation_core/templates'
layouts={}
for p in sorted(root.glob('*.svg')):
    r=ET.parse(p).getroot(); shapes=[]; slots={}
    for node in r:
        a=node.attrib; tag=node.tag.split('}')[-1]
        if a.get('id')=='master-background': continue
        if tag=='g' and 'data-pptx-bounds' in a:
            carrier=next((n for n in node if n.attrib.get('data-pptx-carrier')=='true'),None)
            text=''.join(carrier.itertext()).strip() if carrier is not None and carrier.tag.endswith('text') else ''
            slots[a['id']]={'bounds':list(map(float,a['data-pptx-bounds'].split())), 'key':text.strip('{}'), 'kind':a['data-pptx-placeholder']}
        elif tag in ('rect','line','circle'):
            shapes.append({'tag':tag,**a})
    layouts[r.attrib['data-pptx-layout']]={'source':p.name,'shapes':shapes,'slots':slots}
(base/'ppt-master-layouts.js').write_text('/* PPT Master © 2025–2026 Hugo He, MIT. Compiled from the unmodified SVG templates in vendor/ppt-master. */\nwindow.PPTMasterLayouts='+json.dumps(layouts,ensure_ascii=False,separators=(',',':'))+';\n')
