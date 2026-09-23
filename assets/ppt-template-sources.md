# 当前演示模板

当前入口是 `ppt-imported-templates.js`，模板顺序为蓝紫色智能简洁、商业计划书、月度工作汇报、职位晋升汇报、年中总结、年中工作总结。原稿中的装饰、图片和图表被渲染为本地背景画面，文本框单独提取为可编辑文字层。运行文件位于 `user-templates/`；原始 PPTX 不参与网页运行，也未纳入公开代码仓库。图片和图表仍属于原始素材，使用时需核对相应授权。

`ppt-master-layouts.js`、`ppt-master-templates.js` 和 `ppt-templates.js` 保留为前期方案的代码记录，目前不由主页加载。PPT Master 的来源与许可见 [ADAPTER.md](vendor/ppt-master/ADAPTER.md)。

以下保留更早的接入历史。

# PPT Agent 模板接入记录

来源：用户提供的 `PPTskill2/ppt-agent-main`，PPT Agent v4.1。遵循其 MIT 许可，版权声明见 `vendor/PPT-Agent-LICENSE`。

这次接入的是该 Skill 的设计资源，适配到现有数字员工的可编辑元素模型；没有执行其单份演示文稿的采访、研究、逐页生产流程，也没有接入在线生成服务。

## 使用的资源

- `references/styles/blue-white.md`：白底、蓝色标题标注、细分隔线、机构级报告风格。
- `references/styles/minimal-gray.md`：灰白底、黑色排字、红色重点、减少装饰。
- `references/styles/warm-earth.md`：奶油底色、咖啡色文字、暖色强调与柔和圆角。
- `references/styles/dark-tech.md`：深空底色、冷青强调、精密科技感。
- `references/page-templates/cover.md`：单一标题重点、留白、避免通用居中三段式。
- `references/page-templates/toc.md`：不对称导航、区分标题与章节的视觉权重。
- `references/page-templates/end.md`：用一个行动号召收束，而不是只写“谢谢”。
- `references/layouts/primary-secondary.md`：案例页主次结构。
- `references/principles/data-visualization.md`：显示口径与来源；未提供真实数据时保留空值，不画虚构增长图。

## 适配说明

实现文件：`ppt-templates.js`。色值来自上述资源；封面、目录、概览、方法、案例、数据、章节、对比、优先级、路线图、结束页按资源原则实现为独立文字与形状对象。并非直接嵌入示例截图。

新生成文稿默认使用蓝白商务。问答第四步可选择四套主题；生成后工具栏的「模板」可切换主题。新版文稿切换主题保留文字和位置；旧版文稿选择新模板会按原始需求生成新版副本，并在对话与版本历史保留原稿，手工改写不自动迁移。

当前仍为本地模板生成演示。所有主题均能进入现有编辑器、网页全屏、版本保存及 HTML/PPTX 导出。
