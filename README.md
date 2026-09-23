# LedgerMate 财务数字员工演示

下载仓库后打开 `index.html`，即可在本地浏览器使用演示页面。网页、脚本和运行所需图片都保存在仓库内。

当前包含四位数字员工的展示与对话演示。其中 PPT 员工支持需求确认、逐页大纲、六套演示模板、在线编辑、保存与导出。生成内容使用本地规则模拟，尚未接入在线 AI 服务。

模板画面和可编辑文字层位于 `assets/user-templates/`。原始 PPTX 是导入素材，不参与网页运行，因此没有上传到公开仓库。导入工具位于 `tools/import_pptx_templates.py`，模板检查可运行 `node tools/check_ppt_templates.js`。第三方组件的许可文件保存在 `assets/vendor/`。
