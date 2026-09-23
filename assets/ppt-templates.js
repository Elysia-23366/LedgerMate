/* Editable template adapter for the user's PPT Agent design resources.
 * Sources and MIT attribution: ppt-template-sources.md / vendor/PPT-Agent-LICENSE.
 * Uses native text and shape objects so the editor, HTML and PPTX share one model.
 */
(()=>{
  'use strict';
  const catalog=[
    {id:'blue_white',name:'蓝白商务',description:'咨询报告感 · 蓝色标注 · 清晰留白',bg:'#FFFFFF',secondary:'#F8FAFC',surface:'#F1F5F9',line:'#E2E8F0',ink:'#1E293B',muted:'#64748B',accent:'#2563EB',accent2:'#1D4ED8',support:'#059669',radius:12},
    {id:'minimal_gray',name:'极简灰白',description:'黑白排字 · 红色重点 · 精准对齐',bg:'#FAFAFA',secondary:'#F5F5F5',surface:'#FFFFFF',line:'#E5E5E5',ink:'#171717',muted:'#737373',accent:'#171717',accent2:'#404040',support:'#DC2626',radius:4},
    {id:'warm_earth',name:'暖色大地',description:'奶油底色 · 咖啡文字 · 温暖叙事',bg:'#FDF8F0',secondary:'#FAF0E4',surface:'#FFFFFF',line:'#E8D9C7',ink:'#3D2B1F',muted:'#7A6652',accent:'#A0785C',accent2:'#C4956A',support:'#B8922E',radius:18},
    {id:'dark_tech',name:'暗黑科技',description:'深空底色 · 冷青强调 · 发布会感',bg:'#0B1120',secondary:'#0F172A',surface:'#1E293B',line:'#28354B',ink:'#FFFFFF',muted:'#AAB4C4',accent:'#22D3EE',accent2:'#3B82F6',support:'#FDE047',radius:12}
  ];
  const aliases={'庄重商务':'blue_white','简约现代':'minimal_gray','清新明亮':'blue_white'};
  function resolve(value){return catalog.find(t=>t.name===value||t.id===value||t.id===aliases[value])||catalog[0]}
  function build({title,brief,answers,extras,count,element,uid}){
    const t=resolve(answers[3]),training=/培训|教学|课程|课件|学习/.test(brief),year=new Date().getFullYear();
    const minimal=t.id==='minimal_gray',warm=t.id==='warm_earth',dark=t.id==='dark_tech';
    const accent=minimal?t.support:t.accent;
    const chapters=training?['认识目标','掌握方法','实践与复盘']:['回顾进展','洞察问题','明确行动'];
    const topics=training?{
      overview:'先明确目标，再进入学习',process:'把方法拆开，才能真正掌握',case:'让一个具体案例，讲清方法的价值',data:'学习成效，用证据检验',comparison:'识别常见误区，找到改进方向',roadmap:'从理解到实践，走好这三步',detail:'把关键步骤，变成一份操作清单',matrix:'选择方法前，先看适用条件'
    }:{overview:'把关键进展，放在同一张图上',process:'从单点突破，走向可复制的能力',case:'一个关键案例，讲清价值如何发生',data:'先看清数据，再形成判断',comparison:'直面差距，让改进有的放矢',roadmap:'下一阶段，聚焦三件事',detail:'从目标到交付，明确每一步',matrix:'明确优先级，把资源放在关键处'};
    const sequence=count===8?['toc','overview','case','data','comparison','roadmap']:count===10?['toc','overview','process','case','data','section','comparison','roadmap']:['toc','overview','process','case','data','section','comparison','detail','matrix','roadmap'];
    const inner=Array.from({length:Math.max(0,count-2)},(_,i)=>sequence[i%sequence.length]);
    if(inner.length)inner[inner.length-1]='roadmap';
    const layouts=['cover',...inner,'end'];
    return layouts.map((kind,index)=>{
      const elements=[];
      const slide={id:uid(),title:kind==='cover'?title:kind==='toc'?'内容导航':kind==='section'?(training?'从知识，到实践':'从复盘，到行动'):kind==='end'?(training?'让所学，真正用起来':'把共识，变成下一步行动'):topics[kind],bg:t.bg,bg2:t.bg,notes:'',elements,templateId:t.id,layout:kind,templateVersion:3};
      const add=(type,text,x,y,w,h,extra={})=>{const e=element(type,text,x,y,w,h,{font:'Microsoft YaHei',color:t.ink,...extra});elements.push(e);return e};
      const box=(x,y,w,h,color=t.surface,radius=0)=>add('shape','',x,y,w,h,{bg:color,radius});
      const text=(value,x,y,w,h,size=24,color=t.ink,weight=400,extra={})=>{
        const str=String(value),ctx=document.createElement('canvas').getContext('2d');
        const fits=()=>{ctx.font=weight+' '+size+'px '+(extra.font||'Microsoft YaHei');let lines=0;for(const part of str.split('\n')){let width=0;lines++;for(const char of part){const cw=ctx.measureText(char).width;if(width+cw>w-3){lines++;width=0}width+=cw}}return lines*size*1.25<=h};
        while(size>14&&!fits())size--;
        return add('text',str,x,y,w,h,{size,color,weight,...extra});
      };
      const line=(x,y,w,color=t.line)=>box(x,y,w,1,color);
      const panel=(x,y,w,h,fill=t.surface)=>{box(x,y,w,h,t.line,t.radius);box(x+1,y+1,w-2,h-2,fill,Math.max(0,t.radius-1))};
      const eyebrow=(value,x=72,y=48,w=1000)=>text(value,x,y,w,22,13,t.muted,500);
      const number=(value,x,y,w=100)=>text(value,x,y,w,75,56,accent,600,{font:minimal?'Arial':'Microsoft YaHei'});
      const header=(subtitle)=>{
        eyebrow(String(index).padStart(2,'0')+'  /  '+({toc:'CONTENTS',overview:'OVERVIEW',process:'FRAMEWORK',case:'CASE STUDY',data:'EVIDENCE',comparison:'REVIEW',roadmap:'ACTION PLAN',detail:'EXECUTION',matrix:'PRIORITIES'}[kind]||'INSIGHTS'));
        text(slide.title,72,103,1136,75,40,t.ink,700);
        if(!minimal)box(72,190,80,4,t.accent,warm?2:0);
        if(subtitle)text(subtitle,72,210,1136,42,19,t.muted);
      };
      const footer=()=>{
        line(72,651,1136);
        text(title.replace(/\n/g,' ').slice(0,48),72,671,720,24,12,t.muted);
        text(t.name,956,671,120,24,12,t.muted,400,{align:'right'});
      };
      if(kind==='cover'){
        eyebrow((training?'LEARNING & DEVELOPMENT':'BUSINESS REVIEW')+'   /   '+year,76,58,960);
        const heading=/年中/.test(brief)?'年中总结\n与下半年展望':title;
        if(minimal){
          text(String(year),970,54,240,74,58,t.muted,400,{align:'right',font:'Arial'});
          text(heading,76,242,1070,200,heading.length>25?48:70,t.ink,700);
          line(76,489,1132,t.line);box(76,489,94,3,t.support);
          text(training?'让复杂知识，变成可执行的方法。':'让每一个判断，都有清晰的依据。',76,518,1040,52,25,t.muted);
        }else{
          box(886,112,322,432,t.secondary,warm?28:0);
          text(training?'学以\n致用':'看清\n方向',925,171,250,194,64,t.accent,700,{font:warm?'Georgia':'Microsoft YaHei'});
          line(927,412,230,t.line);
          text(training?'KNOW · PRACTICE · GROW':'REVIEW · FOCUS · ACT',927,435,250,52,13,t.muted,500);
          text(heading,76,210,770,204,heading.length>25?46:64,t.ink,700);
          box(76,440,80,4,t.accent,warm?2:0);
          text(training?'从核心概念，到真实场景中的应用。':'从关键事实出发，让下一步行动更清晰。',76,473,754,78,25,t.muted);
        }
        text(answers[0]+'  ·  '+(training?'培训交流':'汇报交流'),76,592,830,32,19,t.muted);
        text(year+' / '+String(new Date().getMonth()+1).padStart(2,'0'),1040,596,164,25,16,t.muted,400,{align:'right'});
        line(76,651,1132);
        slide.notes='开场说明主题、适用受众与这次分享希望达成的目标。';
      }else if(kind==='toc'){
        eyebrow('CONTENTS  /  内容导航');
        text('一条清晰的\n汇报路径。',72,170,470,172,57,t.ink,700);
        text(training?'先建立认识，再通过实践\n形成可复用的方法。':'用事实回顾过去，\n用判断连接下一步。',76,388,400,105,25,t.muted);
        chapters.forEach((v,j)=>{const y=139+j*151;line(584,y,624);text('0'+(j+1),587,y+29,72,62,36,j===0?accent:t.muted,500);text(v,701,y+27,478,46,32,t.ink,600);text((training?['目标、背景与学习地图','框架、案例与常见误区','练习、反馈与行动清单']:['关键成果与事实依据','问题分析与改进机会','优先级、责任与里程碑'])[j],701,y+86,478,39,18,t.muted)});
        footer();
      }else if(kind==='overview'){
        header(training?'让学习目标、应用场景与验收标准保持一致。':'进展、交付与价值，分别用经核实的信息说明。');
        const labels=training?['学习目标','应用场景','成果检验']:['业务进展','重点交付','用户价值'];
        labels.forEach((v,j)=>{const x=72+j*389;line(x,293,350,j===0?accent:t.line);number('0'+(j+1),x,316);text(v,x,402,350,45,30,t.ink,600);text((training?['明确需要掌握的概念\n确认学习后的可执行动作','说明方法适用的条件\n给出一个真实业务情境','约定实践任务与评价方式\n结合反馈检查掌握程度']:['本期目标：待补充\n实际进展：待核实','关键里程碑：待补充\n交付结果：待核实','客户反馈：待补充\n价值依据：待核实'])[j],x,476,344,100,23,t.muted)});
        footer();
      }else if(kind==='process'||kind==='detail'){
        header(training?'将抽象的方法转化为可以理解、练习与验证的步骤。':'围绕问题、行动与验证，建立可以复用的工作方式。');
        ['明确问题','拆解行动','验证结果'].forEach((v,j)=>{const x=72+j*389;panel(x,291,355,293,j===1?t.secondary:t.bg);text('0'+(j+1),x+25,314,85,52,36,accent,600);text(v,x+25,394,302,48,30,t.ink,600);text(['说明背景、目标与约束\n先对齐需要解决的问题','明确方法、责任与步骤\n把目标变成行动清单','核对事实、反馈与结果\n沉淀可复用的经验'][j],x+25,470,302,88,21,t.muted)});
        footer();
      }else if(kind==='case'){
        header('背景 → 行动 → 结果，用完整的证据链解释价值。');
        panel(72,286,688,306,t.secondary);eyebrow('THE CONTEXT',103,315,588);text(training?'在一个真实场景中，\n尝试使用这套方法。':'找到真正的问题，\n再讲清行动的价值。',103,367,596,112,35,t.ink,600);
        text(extras[3]?extras[3].slice(0,100):'请补充案例背景、实际做法与可验证结果。\n模板内容用于提示结构，不代表已发生的事实。',103,509,594,68,20,t.muted);
        [['关键行动','采取了哪些方法？\n有哪些协作与取舍？'],['结果与启发','有哪些可验证的变化？\n哪些经验可以继续复用？']].forEach(([a,b],j)=>{let y=286+j*161;line(804,y,404);text(a,804,y+21,400,38,25,t.ink,600);text(b,804,y+76,396,72,21,t.muted)});
        footer();
      }else if(kind==='data'){
        header('展示真实指标、统计口径和数据来源，避免仅凭数字下结论。');
        eyebrow('KEY INDICATOR',72,303,340);text('—',72,348,326,108,82,accent,600,{font:'Arial'});text(training?'核心学习指标':'核心业务指标',72,465,332,44,28,t.ink,600);text('实际值待补充\n统计期间与口径待确认',72,528,335,66,20,t.muted);
        const x=473,w=735;box(x,292,w,46,t.secondary,warm?8:0);
        ['指标','上期','本期','变化'].forEach((v,j)=>text(v,[490,785,930,1074][j],304,j===0?270:120,29,17,t.muted,500));
        (training?['目标完成度','实践完成度','反馈与改进']:['业务规模','交付情况','客户反馈']).forEach((v,j)=>{const y=356+j*74;text(v,490,y,270,39,23,t.ink,500);[785,930,1074].forEach(xx=>text('—',xx,y,108,39,24,j===1?accent:t.muted,500));line(x,y+53,w)});
        text('来源：待补充  ·  样例字段未填入实际数据',490,600,700,28,15,t.muted);
        footer();
      }else if(kind==='section'){
        eyebrow('PART 02  /  THE NEXT CHAPTER');
        text('02',75,150,390,205,166,t.line,600,{font:'Arial'});
        text(slide.title,420,247,780,99,60,t.ink,700);
        text(training?'把理解变成能力，把方法用进工作。':'把问题转化为行动，把目标落实到责任。',424,385,756,86,26,t.muted);
        if(!minimal)box(424,516,80,4,t.accent,warm?2:0);
        footer();
      }else if(kind==='comparison'){
        header('让问题描述与改进动作一一对应，形成可检查的闭环。');
        const cols=[['当前需要厘清','问题与现象','影响范围是什么？','有哪些事实与约束？','优先解决哪一项？'],['下一步如何推进','改进与验证','选定一个可执行动作','明确责任人与完成时间','约定验证标准与复盘点']];
        cols.forEach((a,j)=>{const x=72+j*587;panel(x,289,549,309,j?t.secondary:t.bg);eyebrow(a[0],x+28,315,480);text(a[1],x+28,359,480,53,33,j?accent:t.ink,600);a.slice(2).forEach((v,k)=>{text('0'+(k+1),x+28,442+k*44,40,30,17,t.muted);text(v,x+84,440+k*44,428,33,23,t.ink)})});
        footer();
      }else if(kind==='matrix'){
        header('先确认影响与约束，再决定执行顺序。');
        const rows=[['优先推进','与核心目标直接相关','先确认负责人及验收标准'],['持续验证','仍需要补充事实依据','以小范围试点降低不确定性'],['阶段观察','当前价值或条件不明确','保留记录，约定复核时间']];
        rows.forEach((r,j)=>{const y=295+j*98;if(j===0)box(72,y,1136,87,t.secondary,warm?12:0);text(r[0],96,y+25,230,42,26,j===0?accent:t.ink,600);text(r[1],376,y+27,355,40,23,t.ink);text(r[2],776,y+28,397,39,20,t.muted);line(72,y+89,1136)});
        footer();
      }else if(kind==='roadmap'){
        header(training?'通过练习、应用与反馈，让方法成为自己的能力。':'行动有顺序、责任有归属、进展有依据。');
        const labels=training?['理解与练习','场景应用','复盘与迁移']:['对齐目标','推进关键动作','验证与复盘'];
        line(101,328,1074,t.line);labels.forEach((v,j)=>{let x=72+j*389;box(x+20,320,16,16,j===0?accent:t.line,warm?8:2);eyebrow('PHASE 0'+(j+1),x,365,335);text(v,x,403,354,52,32,t.ink,600);text(['确认目标与验收标准\n划定范围，形成共识','落实责任人与关键节点\n按优先级推进任务','核对结果与实际反馈\n沉淀经验，持续改进'][j],x,487,348,82,22,t.muted);text('负责人 / 时间：待确认',x,592,355,28,15,t.muted)});
        footer();
      }else{
        eyebrow('THE NEXT STEP  /  下一步');
        text(training?'让所学，':'把共识，',76,213,1100,109,72,t.ink,700);
        text(training?'真正用起来。':'变成下一步行动。',76,320,1125,113,72,accent,700);
        line(79,507,1129);
        text(training?'选一个真实任务 · 尝试使用方法 · 带着结果复盘':'确认优先事项 · 明确负责人 · 约定复盘时间',79,542,1087,61,26,t.muted);
        text(title.slice(0,48),79,671,1000,24,12,t.muted);
      }
      slide.notes=slide.notes||'本页核心：'+slide.title+'。结合实际业务资料展开说明；涉及数据、时间、案例与责任人的内容，需补充并核对后使用。';
      return slide;
    });
  }
  window.PPTTemplates={catalog,resolve,build,version:3};
})();
