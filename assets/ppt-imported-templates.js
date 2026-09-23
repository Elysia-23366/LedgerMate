/* User-supplied PPTX templates. Original artwork plates + editable text layers.
 * All source files remain in user-templates; no remote requests are required. */
(()=>{'use strict';
 const catalog=[
 {id:'smartblue',name:'蓝紫色智能简洁',description:'蓝紫科技 · 26 页原稿版式',accent:'#5D62DF',ink:'#23265A',muted:'#787BB0',bg:'#FFFFFF'},
 {id:'businessplan',name:'商业计划书',description:'商业策划 · 18 页原稿版式',accent:'#F0A55A',ink:'#382B40',muted:'#806E7A',bg:'#FFFFFF'},
 {id:'monthly',name:'月度工作汇报',description:'月度复盘 · 14 页原稿版式',accent:'#4C83CF',ink:'#182B52',muted:'#667FA9',bg:'#FFFFFF'},
 {id:'promotion',name:'职位晋升汇报',description:'岗位晋升 · 15 页原稿版式',accent:'#6381CC',ink:'#252E50',muted:'#737E9A',bg:'#FFFFFF'},
 {id:'midyear',name:'年中总结',description:'蓝色飘带 · 25 页原稿版式',accent:'#3683CA',ink:'#163C68',muted:'#547899',bg:'#FFFFFF'},
 {id:'workreview',name:'年中工作总结',description:'黑金商务 · 33 页原稿版式',accent:'#B9985D',ink:'#172233',muted:'#887757',bg:'#FFFFFF'}
 ];
 const aliases={blue_white:'midyear',minimal_gray:'smartblue',warm_earth:'businessplan',dark_tech:'workreview','战略咨询':'businessplan','极简刊物':'smartblue','人文课堂':'monthly','科技发布':'smartblue','蓝白商务':'midyear',watercolor:'monthly',summary:'midyear','水彩扎染':'monthly','总结汇报':'midyear'};
 const resolve=v=>catalog.find(t=>t.id===v||t.name===v||t.id===aliases[v])||catalog[0];
 const plans={
 smartblue:{cover:[1],toc:[2],section:[3,7,12,16],overview:[4,5,8,18,19,20],process:[15,21,23],case:[9,17,22,24],data:[10,14,25],comparison:[6,11,17],detail:[13,18,19],roadmap:[20,21,25],end:[26]},
 businessplan:{cover:[1],toc:[2],section:[3,6,9,13,16],overview:[4,7],process:[11,14,15],case:[5,10,12],data:[8,17],comparison:[8,12],detail:[4,7,10],roadmap:[15,17],end:[18]},
 monthly:{cover:[1],toc:[2],section:[3,6,9,11],overview:[4,5],process:[10,12,13],case:[4,8],data:[7,8],comparison:[9,10],detail:[5,7],roadmap:[11,12,13],end:[14]},
 promotion:{cover:[1],toc:[2],section:[3,6,10,13],overview:[4,5],process:[7,11],case:[8,9],data:[5,8],comparison:[7,9],detail:[4,12],roadmap:[13,14],end:[15]},
 midyear:{cover:[1],toc:[2],section:[3,8,13,18,21],overview:[4,6],process:[5,20],case:[7,15,16],data:[9,10,11,12],comparison:[17,19],detail:[14],roadmap:[22,23,24],end:[25]},
 workreview:{cover:[1],toc:[2],section:[3,9,15,21,27],overview:[4,8],process:[17,19,22,25],case:[6,10,13,16,20,28],data:[7,11,12,18,29,31],comparison:[5,14,23],detail:[26,30],roadmap:[24,32],end:[33]}
 };
 const roles={cover:'封面',toc:'目录',section:'章节',overview:'概览',process:'流程',case:'案例',data:'数据',comparison:'对比',detail:'要点',roadmap:'计划',end:'结束'};
 const roleOf=(t,n)=>Object.keys(plans[t.id]).find(k=>plans[t.id][k].includes(n))||'detail';
 function titleOf(v){return String(v||'工作总结').replace(/^.*?(?:帮我|请)(?:制作|设计|做|生成)?(?:一份|一个|个)?/,'').replace(/\d+\s*页(?:的|左右)?/g,'').replace(/(?:PPT|ppt|演示文稿|幻灯片)/g,'').replace(/[，,。；;].*$/,'').trim()||'工作总结'}
 function context({title,brief='',answers=[],extras=[]}){
 const subject=titleOf(title),training=/培训|学习|课件|课程|教学/.test(brief),product=/产品|方案|项目|上线|功能/.test(brief);
 const focus=answers[1]||'';const sections=training?['学习目标','核心概念','实践案例','问题讨论','行动计划']:product?['项目背景','解决方案','关键功能','实施安排','后续计划']:['工作回顾','完成情况','项目展示','问题改进','未来计划'];
 const blocks={overview:['背景目标','重点事项','关键进展','成果记录'],process:['明确目标','任务拆解','实施推进','结果验收'],case:['业务背景','实施方法','结果记录','经验总结'],data:['核心指标','统计口径','期间对比','数据来源'],comparison:['当前状况','主要问题','原因分析','改进措施'],detail:['具体事项','责任分工','交付内容','验收标准'],roadmap:['近期安排','重点任务','资源协作','完成节点']};
 const paragraphs={overview:['说明本次工作的背景与范围。','列出与目标直接相关的重点事项。','补充已经完成的进展及对应材料。','实际成果和相关依据待补充。'],process:['确认目标、范围及成功标准。','拆分任务，明确负责人和依赖条件。','按约定节点推进并记录问题。','对照验收标准核实交付结果。'],case:['补充案例的实际场景与目标。','说明采用的方法和关键操作。','提供可核实的结果，注明统计口径。','总结适用条件与后续改进事项。'],data:['填写实际数值，并注明统计期间。','统一指标定义与计算方法。','使用相同口径进行期间对比。','补充来源，核实后再形成结论。'],comparison:['客观描述当前状态和影响范围。','明确需要解决的问题。','用证据检验原因，保留不确定项。','约定行动、负责人和复核时间。'],detail:['补充具体工作范围。','明确责任人与协作方式。','写明预期交付物。','说明如何检查完成情况。'],roadmap:['确定优先推进的事项。','写明阶段目标与关键动作。','明确资源需求和协作条件。','约定完成时间及复盘节点。']};
 const supplied=[...extras.slice(0,3),extras[3]||'',...brief.split(/[\n；;]/).slice(1)].filter(Boolean).flatMap(s=>s.split(/[\n；;]/)).map(s=>s.trim()).filter(s=>s.length>8&&!/^(深色|浅色|蓝色|红色|黑色|水彩|风格)/.test(s));
 return {subject,sections,blocks,paragraphs,supplied,training,focus};
 }
 function measure(text,size,font){const c=document.createElement('canvas').getContext('2d');c.font=size+'px '+font;return c.measureText(text).width}
 function fitted(e){
  // Retain the original text container; reduce type only when its contents do not fit.
  let size=e.size,lines=1;const calc=()=>{lines=0;for(const row of e.text.split('\n')){let width=0;lines++;for(const char of row){const cw=measure(char,size,e.font);if(width+cw>e.w-2){lines++;width=0}width+=cw}}return lines*size*1.25<=e.h+1};
  while(size>9&&!calc())size-=.5;calc();e.size=Math.max(9,size);const contentH=lines*e.size*1.25;
  if(e.anchor==='ctr'&&contentH<e.h)e.y+=(e.h-contentH)/2;
  if(e.anchor==='b'&&contentH<e.h)e.y+=e.h-contentH;
  e.h=Math.min(e.h,Math.max(contentH+2,e.size*1.25));return e;
 }
 function cleanPreview(e){
  let s=e.text;
  if(/202X|2030/.test(s))s=s.replace(/202X(?:\.X)?(?:年11月19日)?|2030/g,'2026');
  if(/请根据主题填写内容/.test(s))return '请补充相关内容';
  if(/^[｜|]/.test(s))return '工作总结与计划';
  if(/标题|关键文字/.test(s)&&/输入|添加|点击|标题文字/.test(s))return '工作要点';
  if(/输入正文|正文是|单击|黏贴|粘贴|添加文字说明|请在此|请补充/.test(s))return /标题/.test(s)?'工作要点':'请补充相关业务内容';
  return s;
 }
 function createPage(t,n,{uid,element,ctx=null,role=null,index=0}={}){
  const raw=PPTImportedLibrary[t.id].pages[n-1],kind=role||roleOf(t,n);let head=0,body=0,sectionIndex=0;
  let originals=raw.elements.map(e=>({...e}));
  // Irrelevant vertical filler and redundant narrow fragments are removed, not rasterized.
  originals=originals.filter(e=>!(e.w<18&&/请补充|ADD/.test(e.text)));
  const major=originals.filter(e=>e.size>=28&&!/^\d+[.%]?$/i.test(e.text)&&!/^20\d|^PART|^ONE|^TWO|^THREE|^FOUR|^FIVE|^[A-Z\s]+$/.test(e.text));
  const imported=['smartblue','businessplan','monthly','promotion'].includes(t.id);
  const heading=(imported?major.filter(e=>/[\u4e00-\u9fff]/.test(e.text)&&!/^请/.test(e.text)).sort((a,b)=>b.size-a.size||a.y-b.y)[0]:null)||major.sort((a,b)=>a.y-b.y||b.size-a.size)[0];
  const specs=originals.map(src=>{
   const e={...src,text:cleanPreview(src)};
   if(ctx){const b=ctx.blocks[kind]||ctx.blocks.overview,p=ctx.paragraphs[kind]||ctx.paragraphs.overview;
    if(kind==='cover'||kind==='end'){
     if(t.id==='midyear'){
      const phrase=kind==='end'?['汇报结束','感谢','观','看']:['工作回顾','未来','可','期'];
      const j=['行而不缀','未来','可','期'].indexOf(src.text);if(j>=0)e.text=phrase[j];
      if(src.text==='年中工作总结')e.text=kind==='end'?'感谢观看':ctx.subject;
     }else if(src===heading)e.text=kind==='end'?'感谢观看':ctx.subject;
     if(/请补充相关内容|请根据主题填写内容/.test(src.text))e.text=kind==='end'?'欢迎交流与讨论':ctx.supplied[0]||'汇报范围与主要内容待补充';
     if(/^[｜|]/.test(src.text))e.text=ctx.subject;
    }else if(kind==='toc'){
     if(/工作回顾|完成情况|项目展示|工作不足|未来计划|年中工作概述|工作完成情况|项目展示计划|未来工作计划|标题文字/.test(src.text)){
      const prefix=src.text.match(/^0[1-5]/)?.[0];e.text=(prefix?prefix+'  ':'')+ctx.sections[(prefix?+prefix-1:sectionIndex++)%ctx.sections.length];
     }else if(/请补充相关内容|请根据主题填写内容/.test(src.text))e.text=['目标与业务范围','事实与完成进展','案例与实践方法','问题与后续安排'][body++%4];
    }else if(kind==='section'){
     if(src.text===heading?.text)e.text=ctx.sections[Math.min(4,Math.floor(index/3))];
     if(/请补充相关内容|请根据主题填写内容/.test(src.text))e.text='本节围绕相关事项展开说明';
    }else{
     if(src.text===heading?.text&&src.y<150)e.text=({overview:ctx.sections[0],case:ctx.sections[2],data:'数据与完成情况',comparison:'问题与改进',process:'实施流程',roadmap:ctx.sections[4],detail:'重点工作安排'})[kind];
     else if(/标题|关键文字|工作内容|完成情况[一二三四五六]/.test(src.text)&&src.source!=='chart-label')e.text=b[head++%b.length];
     else if(/输入正文|正文是|单击|黏贴|粘贴|添加文字说明|请在此|请补充|请根据主题填写内容|Please|There are many|A company/i.test(src.text)){e.text=ctx.supplied[body]||p[body%p.length];body++;}
     // Fixed sample values are not promoted into user business facts.
     else if(src.source!=='chart-label'&&/^\d[\d,.$%]*$/.test(src.text)&&(/[%,.$]/.test(src.text)||+src.text>100))e.text='待补充';
    }
   }
   // Source has vertical labels authored with a narrow text box.
   if(e.w<85&&e.h>e.w*3&&/^[A-Za-z\s]+$/.test(e.text)){
    const oldW=e.w,oldH=e.h;e.x+=(oldW-oldH)/2;e.y+=(oldH-oldW)/2;e.w=oldH;e.h=oldW;e.rotate=90;
   }
   // In the red source, the year is four overlapping letter boxes: merge faithfully.
   return fitted(e);
  });
  const els=[element('image','原稿背景与装饰',0,0,1280,720,{src:raw.asset,fit:'contain',locked:true,templateBackground:true})];
  for(const e of specs){const {originalText,source,anchor,...props}=e;els.push(element('text',e.text,e.x,e.y,e.w,e.h,{...props,sourceText:originalText,sourceRole:source}));}
  if(raw.charts.length||specs.some(e=>/\d+%/.test(e.text))){els.push(element('text','图形为模板示例，业务数据待替换',820,694,414,22,{size:12,color:t.muted,font:'Microsoft YaHei',align:'right'}));}
  return {id:uid(),title:ctx?({cover:ctx.subject,end:'感谢观看'}[kind]||roles[kind]):t.name+' · '+roles[kind],elements:els,bg:'#FFFFFF',bg2:'#FFFFFF',notes:'原稿：'+t.name+'，第 '+n+' 页。文字可编辑，背景与装饰保留为图片图层。涉及图表的图形为原模板示例。',templateId:t.id,templateVersion:5,sourcePage:n,layout:kind};
 }
 function build(opts){const t=resolve(opts.answers[3]),ctx=context(opts),count=opts.count||10;
  let inner=ctx.training?['toc','overview','process','case','comparison','detail','roadmap']:ctx.focus.includes('问题')?['toc','overview','comparison','data','case','process','detail','roadmap']:['toc','overview','data','case','process','comparison','detail','roadmap'];
  inner=Array.from({length:count-2},(_,i)=>inner[i%inner.length]);if(inner.length)inner[inner.length-1]='roadmap';const used={};
  const kinds=opts.roles?.length===count?opts.roles:['cover',...inner,'end'];
  return kinds.map((kind,i)=>{const candidates=plans[t.id][kind]||plans[t.id].detail;let n=candidates[(used[kind]||0)%candidates.length];used[kind]=(used[kind]||0)+1;return createPage(t,n,{uid:opts.uid,element:opts.element,ctx,role:kind,index:i})});
 }
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function preview(t,n=1){let seq=0;const s=createPage(t,n,{uid:()=>String(++seq),element:(type,text,x,y,w,h,props)=>({type,text,x,y,w,h,...props})});return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><image width="1280" height="720" href="'+PPTTemplateAssets[s.elements[0].src]+'"/>'+s.elements.slice(1).map(e=>`<foreignObject x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" transform="rotate(${e.rotate||0} ${e.x+e.w/2} ${e.y+e.h/2})"><div xmlns="http://www.w3.org/1999/xhtml" style="font:${e.weight||400} ${e.size}px/1.25 Arial,Microsoft YaHei,sans-serif;color:${e.color};text-align:${e.align};white-space:pre-wrap;overflow-wrap:anywhere">${escape(e.text)}</div></foreignObject>`).join('')+'</svg>'}
 window.PPTTemplates={catalog,resolve,build,preview,createPage,roleOf,roles,version:5};
})();
