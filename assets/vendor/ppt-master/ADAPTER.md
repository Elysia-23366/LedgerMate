# PPT Master 模板接入

上游：https://github.com/hugohe3/ppt-master

来源：官方完整发行包，Skill 版本 6.6.0；2026-09-21 下载。完整包使用原始 attribution_guard.py 校验通过，未修改校验脚本。

版权：Copyright (c) 2025–2026 Hugo He。MIT 许可见本目录 LICENSE。

本项目的交付物是 HTML 应用中的模板适配器，不是上游工作流生成的 PowerPoint 母版包。

`presentation_core/templates/` 保留官方 SVG 原件。`assets/ppt-master-layouts.js` 从 SVG 提取版式形状与占位区域，`assets/ppt-master-templates.js` 使用这些坐标填入中文内容，并扩展四套配色及封面。文案、图形都是现有编辑器的原生对象，未将整页转换为不可编辑图片。

实际使用 Hero Statement、Editorial Split、Three-Card Synthesis、Process Timeline、Data Story、Comparison、Table Summary 七类官方版式，组合为封面、目录、概览、流程、案例、数据、章节、对比、交付表、优先级表、路线、结束页。

源 SVG 中的示范数值不作为用户业务事实使用。数据缺失时保留待补充标记。

本项目的配色、中文内容与封面扩展属于适配层，非官方原版成稿。当前仍为本地 Mock 生成；未新增模型 API。
