/* PPT Master © Hugo He, MIT. Native-object adapter; original SVGs are in vendor/ppt-master.
 * Geometry comes from the official slots; all text and shapes remain editable. */
(()=>{'use strict';
 const catalog=[
 {id:'blue_white',name:'战略咨询',description:'深蓝封面 · 证据分栏 · 管理层汇报',bg:'#FFFFFF',secondary:'#F2F5FA',surface:'#E8EFF9',line:'#D6DFEB',ink:'#142D48',muted:'#627489',accent:'#245EE8',accent2:'#84ACFF',support:'#D8843F',hero:'#102B46',heroText:'#FFFFFF',heroMuted:'#B3C9E3',radius:0},
 {id:'minimal_gray',name:'极简刊物',description:'黑白大字 · 橙色标记 · 编辑式叙事',bg:'#F9F8F4',secondary:'#EEEDE7',surface:'#E4E2D9',line:'#D2D0C6',ink:'#242720',muted:'#74776E',accent:'#CA502D',accent2:'#E8B28F',support:'#617761',hero:'#262B25',heroText:'#FFFDF7',heroMuted:'#C6CABD',radius:0},
 {id:'warm_earth',name:'人文课堂',description:'奶油纸色 · 森林绿 · 培训与知识分享',bg:'#FBF8EF',secondary:'#F0EDDF',surface:'#E2E8D9',line:'#D1D7C5',ink:'#24483E',muted:'#718078',accent:'#397762',accent2:'#B4C8A0',support:'#B36C41',hero:'#24483E',heroText:'#FFFBEF',heroMuted:'#CFD9BA',radius:8},
 {id:'dark_tech',name:'科技发布',description:'午夜底色 · 青绿高光 · 产品与技术方案',bg:'#101F2B',secondary:'#192D3A',surface:'#243D49',line:'#345362',ink:'#EAF5F6',muted:'#A2BAC6',accent:'#65DCC6',accent2:'#398FA5',support:'#E1BD83',hero:'#091721',heroText:'#F2FFFF',heroMuted:'#9DBCCB',radius:4}];
 const aliases={'蓝白商务':'blue_white','庄重商务':'blue_white','极简灰白':'minimal_gray','简约现代':'minimal_gray','暖色大地':'warm_earth','暗黑科技':'dark_tech','清新明亮':'blue_white'};
 const resolve=v=>catalog.find(t=>t.id===v||t.name===v||t.id===aliases[v])||catalog[0];
 function build({title,brief='',answers=[],extras=[],count=10,element,uid}){
 const t=resolve(answers[3]),training=/培训|教学|课程|课件|学习/.test(brief),year=new Date().getFullYear();
 const seq=count<=8?['toc','overview','case','data','comparison','roadmap']:['toc','overview','process','case','data','section','comparison','detail','matrix','roadmap'];
 const mid=Array.from({length:Math.max(0,count-2)},(_,i)=>seq[i%seq.length]);if(mid.length)mid[mid.length-1]='roadmap';
 const titles={cover:title,toc:'从全局认识，到下一步行动',overview:training?'明确三个目标，再开始学习':'用三个视角，看清本期进展',process:'让工作沿着清晰的路径推进',case:'用一个真实案例，讲清价值',data:'先呈现证据，再形成判断',section:training?'把知识转化为能力':'从洞察走向行动',comparison:'看清差距，才能确定改进动作',detail:'把目标落实到具体交付',matrix:'先判断优先级，再配置资源',roadmap:'下一阶段的行动路线',end:training?'让所学，真正用起来':'让共识，成为下一步行动'};
 const mapping={cover:'hero_statement',toc:'editorial_split',overview:'three_card',process:'process_timeline',case:'editorial_split',data:'data_story',section:'hero_statement',comparison:'comparison',detail:'table_summary',matrix:'table_summary',roadmap:'process_timeline',end:'hero_statement'};
 return ['cover',...mid,'end'].map((kind,index)=>{
 const official=PPTMasterLayouts[mapping[kind]],elements=[];
 const slide={id:uid(),title:titles[kind],bg:t.bg,bg2:t.bg,elements,notes:'',templateId:t.id,templateVersion:4,layout:kind,sourceLayout:official.source};
 const shape=(x,y,w,h,fill='secondary',radius=0,more={})=>{const e=element('shape','',x,y,w,h,{bg:t[fill]||fill,bgToken:t[fill]?fill:undefined,radius,...more});elements.push(e);return e};
 const tx=(value,x,y,w,h,size=24,color='ink',weight=400,more={})=>{
 const str=String(value),ctx=document.createElement('canvas').getContext('2d');
 const fits=()=>{ctx.font=weight+' '+size+'px Arial, "Microsoft YaHei"';let lines=0;for(const part of str.split('\n')){let row=0;lines++;for(const char of part){const cw=ctx.measureText(char).width;if(row+cw>w-4){lines++;row=0}row+=cw}}return lines*size*1.27<=h-2};while(size>14&&!fits())size--;
 const e=element('text',str,x,y,w,h,{font:'Microsoft YaHei',size,color:t[color]||color,colorToken:t[color]?color:undefined,weight,...more});elements.push(e);return e};
 const line=(x,y,w,color='line')=>shape(x,y,w,1,color);
 const slot=key=>Object.values(official.slots).find(s=>s.key===key)?.bounds;
 const slotText=(key,value,size=32,color='ink',weight=600)=>{const b=slot(key);if(b)return tx(value,...b,size,color,weight)};
 const base=(omit=[])=>official.shapes.forEach(a=>{if(omit.some(s=>a.id.includes(s)))return;if(a.tag==='rect')shape(+a.x,+a.y,+a.width,+a.height,a.fill==='#CBD5E1'?'accent2':'secondary',t.radius);if(a.tag==='line')shape(+a.x1,+a.y1,+a.x2-(+a.x1),+a['stroke-width']||2,'line');if(a.tag==='circle'){shape(+a.cx-(+a.r),+a.cy-(+a.r),+a.r*2,+a.r*2,'accent',100);shape(+a.cx-5,+a.cy-5,10,10,'bg',100)}});
 const footer=()=>{line(64,665,1152);tx(title.replace(/\n/g,' ').slice(0,55),64,678,860,22,12,'muted')};
 const header=()=>{slotText('PAGE_TITLE',titles[kind],36);if(!slot('PAGE_TITLE'))tx(titles[kind],64,48,1152,76,36,'ink',700);shape(64,125,44,4,'accent');tx(String(index).padStart(2,'0')+' / '+kind.toUpperCase(),968,20,246,19,11,'muted',500,{align:'right'})};
 const badge=(v,x,y)=>{shape(x,y,30,30,'hero');tx(v,x,y+3,30,23,16,'heroText',700,{align:'center'})};
 if(['cover','section','end'].includes(kind)){
 slide.bg=slide.bg2=t.hero;slide.bgToken='hero';const h=slot('KEY_MESSAGE');
 shape(64,64,1152,2,'heroMuted',0,{opacity:.3});tx('LEDGERMATE / '+(training?'LEARNING SERIES':'BUSINESS PRESENTATION'),64,31,1010,24,14,'heroMuted',500);shape(64,125,52,6,'accent');
 tx(kind==='cover'?title:titles[kind],h[0]-32,h[1]+12,790,210,kind==='cover'?64:66,'heroText',700);
 tx(kind==='cover'?(training?'建立认知 · 理解方法 · 应用到真实场景':'梳理关键事实，连接判断与行动'):kind==='section'?'把问题拆开，把责任落实，把结果验证。':'确定一项优先行动，从今天开始。',64,437,790,80,25,'heroMuted');
 shape(906,187,290,290,'accent2',200,{opacity:.26});shape(936,217,230,230,'hero',200);shape(969,250,164,164,'accent',150,{opacity:.7});shape(996,277,110,110,'hero',100);
 tx(kind==='cover'?'01':kind==='section'?'02':'→',1001,302,102,60,42,'heroText',500,{align:'center'});tx(kind==='cover'?'IDEAS → IMPACT':kind==='section'?'INSIGHT → ACTION':'NEXT / TOGETHER',895,515,312,25,14,'heroMuted',500,{align:'center'});
 line(64,583,1152,'heroMuted');['明确目标','梳理证据','推进下一步'].forEach((v,j)=>{tx('0'+(j+1),64+j*335,613,47,32,20,'accent');tx(v,119+j*335,613,238,32,20,'heroText')});tx(String(year),1091,611,118,30,20,'heroMuted',400,{align:'right'});
 }else if(kind==='toc'||kind==='case'){
 base(['rail']);const right=Object.values(official.slots).find(s=>s.kind==='picture').bounds;
 tx(kind==='toc'?'CONTENTS':'CASE / CONTEXT',64,66,448,26,14,'accent',700);tx(kind==='toc'?'一条完整的\n思考路径。':'从一个问题，\n到一次改进。',64,151,448,163,52,'ink',700);
 tx(kind==='toc'?'每一个结论都需要依据，\n每一项行动都需要回应问题。':'请用真实业务材料填充案例，\n将事实与判断分开呈现。',64,383,448,100,25,'muted');tx(kind==='toc'?'01 — 03 / STRUCTURE':'背景 → 行动 → 结果',64,565,448,35,17,'accent',500);
 const labels=kind==='toc'?(training?['建立核心认识','理解方法与案例','实践与成果检验']:['回顾事实与进展','识别问题与机会','明确计划与行动']):['背景与约束','方法与关键动作','结果与可复用经验'];
 const details=kind==='toc'?['对齐目标、背景与关键信息','用证据支持判断，保留待确认项','落实负责人、节点与验收标准']:['业务场景 / 目标 / 约束：待补充','实际做法 / 协作过程：待补充','可核实的结果与启发：待补充'];
 labels.forEach((v,j)=>{let y=right[1]+46+j*175;tx('0'+(j+1),right[0]+32,y,74,56,38,'accent',500);tx(v,right[0]+126,y+2,453,45,28,'ink',700);tx(details[j],right[0]+126,y+65,449,53,20,'muted');if(j<2)line(right[0]+32,y+139,right[2]-64)});
 }else if(kind==='overview'){
 base();header();['CARD_1','CARD_2','CARD_3'].forEach((key,j)=>{const[x,y,w]=slot(key);tx('0'+(j+1),x,y+10,w,90,70,j===1?'accent':'muted');line(x,y+131,w);tx((training?['理解概念','学会方法','验证成果']:['核心进展','重点交付','业务价值'])[j],x,y+163,w,56,33,'ink',700);tx((training?['建立清晰的知识地图\n明确适用条件与边界','拆解步骤与关键动作\n结合真实案例练习','通过任务检查掌握程度\n根据反馈改进方法']:['本期目标：待补充\n实际进展：待核实','关键里程碑：待补充\n交付结果：待核实','用户反馈：待补充\n价值依据：待核实'])[j],x,y+246,w,112,22,'muted');shape(x,y+392,40,4,'accent')});footer();
 }else if(kind==='process'||kind==='roadmap'){
 base();header();['STEP_1','STEP_2','STEP_3','STEP_4'].forEach((key,j)=>{const[x,y,w]=slot(key);tx('0'+(j+1),x,y,w,58,43,'accent',500,{align:'center'});tx(['对齐目标','组织行动','推进交付','验证复盘'][j],x,302,w,48,28,'ink',700,{align:'center'});tx(['明确范围与成功标准\n识别主要约束','拆解工作与协作关系\n确认责任归属','按节点完成关键事项\n记录过程与反馈','核对目标和实际结果\n沉淀可复用经验'][j],x,387,w,112,21,'muted',400,{align:'center'})});slotText('KEY_MESSAGE','每个阶段都需要：明确负责人 · 约定完成时间 · 留下可验证的交付',20,'ink',400);footer();
 }else if(kind==='data'){
 base();header();const[x,y,w,h]=slot('CONTENT_AREA'),[rx,ry,rw]=slot('KEY_MESSAGE');badge('A',x,y);tx('核心指标与统计口径',x+47,y+1,w-47,39,24,'ink',700);
 tx('指标名称',x,y+63,296,31,17,'muted');tx('本期',x+325,y+63,137,31,17,'muted');tx('对照期',x+497,y+63,145,31,17,'muted');
 ['业务规模','交付效率','质量与反馈'].forEach((v,j)=>{let yy=y+122+j*77;line(x,yy-15,w);tx(v,x,yy,310,42,25,'ink',500);tx('—',x+325,yy,125,42,28,'accent',700);tx('—',x+497,yy,145,42,28,'muted')});tx('数据尚未提供；请补充实际值、单位、期间与来源。',x,y+h-34,w,30,15,'muted');badge('B',rx,ry);tx('需要回答的问题',rx,ry+65,rw,50,27,'ink',700);
 ['发生了什么变化？','变化的原因是什么？','接下来要做什么？'].forEach((v,j)=>{tx('0'+(j+1),rx,ry+148+j*53,40,32,17,'accent',500);tx(v,rx+47,ry+146+j*53,rw-47,39,20,'ink')});tx('判断须由左侧数据支持。',rx,ry+337,rw,34,17,'muted');slotText('SOURCE','来源 / 统计期间 / 比较口径：待确认',14,'muted',400);
 }else if(kind==='comparison'){
 base(['divider']);header();[['LEFT_TITLE','LEFT_CONTENT','当前状况',['现象与问题','影响范围','待核实的原因']],['RIGHT_TITLE','RIGHT_CONTENT','改进方向',['可执行的动作','负责人和节点','结果验证标准']]].forEach(([tk,bk,label,rows],j)=>{slotText(tk,label,29,j?'accent':'ink');const[x,y,w]=slot(bk);rows.forEach((v,k)=>{let yy=y+17+k*107;tx('0'+(k+1),x,yy,54,46,29,j?'accent':'muted',600);tx(v,x+76,yy,w-76,43,26,'ink',600);tx('根据业务材料补充具体说明',x+76,yy+47,w-76,31,18,'muted');if(k<2)line(x,yy+88,w)})});footer();
 }else{
 header();const rows=kind==='detail'?[['目标对齐','确认范围','待分配'],['关键交付','明确节点','待分配'],['结果验收','核对标准','待分配'],['复盘沉淀','形成记录','待分配']]:[['优先推进','直接支持核心目标','明确动作'],['持续验证','需要补充证据','小范围试点'],['阶段观察','条件尚不明确','约定复核'],['暂缓安排','暂不满足约束','保留依据']];
 const a=official.shapes.find(a=>a.id==='table-summary-table-panel'),x=+a.x,y=+a.y,w=+a.width;shape(x,y,w,65,'hero');['事项','处理重点',kind==='detail'?'负责人':'下一步'].forEach((v,j)=>tx(v,[88,389,650][j],y+19,[285,245,215][j],33,20,'heroText',600));
 rows.forEach((r,j)=>{let yy=y+65+j*94;shape(x,yy,w,94,j%2?'bg':'secondary');r.forEach((v,k)=>tx(v,[88,389,650][k],yy+29,[285,245,215][k],40,22,k===0?'ink':'muted',k===0?600:400));line(x,yy+93,w)});
 shape(920,152,296,456,'secondary');tx('执行提示',952,183,232,47,28,'accent',700);tx('把每个事项连接到\n一项具体交付，\n再约定检验标准。',952,266,232,149,27,'ink',600);tx('负责人、时间与实际结果\n需要由业务团队确认。',952,492,232,76,18,'muted');footer();
 }
 slide.notes='本页：'+slide.title+'。根据实际资料讲解，未提供的数据与案例仍标记为待补充。版式来源：PPT Master / '+official.source;return slide;
 });}
 function preview(t){let n=0;const s=build({title:'让思考\n成为行动',answers:['','','',t.id],count:4,uid:()=>String(++n),element:(type,text,x,y,w,h,extra)=>({type,text,x,y,w,h,...extra})})[0];const esc=v=>String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));return '<svg viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="1280" height="720" fill="'+s.bg+'"/>'+s.elements.map(e=>e.type==='shape'?`<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="${e.radius||0}" fill="${e.bg}" opacity="${e.opacity??1}"/>`:`<text x="${e.x}" y="${e.y+e.size}" fill="${e.color}" font-family="Arial,Microsoft YaHei,sans-serif" font-size="${e.size}" font-weight="${e.weight}">${e.text.split('\n').map((v,j)=>`<tspan x="${e.x}" dy="${j?e.size*1.25:0}">${esc(v)}</tspan>`).join('')}</text>`).join('')+'</svg>'}
 window.PPTTemplates={catalog,resolve,build,preview,version:4};
})();
