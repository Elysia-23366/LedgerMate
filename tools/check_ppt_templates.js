const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'ledgermate-home.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(assets\/user-templates\/[^\"]+\.js|assets\/ppt-imported-templates\.js)"/g)].map(x => x[1]);
const ctx = { document: { createElement: () => ({ getContext: () => ({ font: '', measureText: text => ({ width: String(text).length * 14 }) }) }) } };
ctx.window = ctx;
vm.createContext(ctx);
for (const src of scripts) {
  const file = path.join(root, src);
  if (!fs.existsSync(file)) throw new Error(`Missing script ${src}`);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: src });
}
const expected = ['smartblue', 'businessplan', 'monthly', 'promotion', 'midyear', 'workreview'];
const actual = ctx.PPTTemplates.catalog.map(t => t.id);
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Wrong catalog order: ${actual}`);
for (const t of ctx.PPTTemplates.catalog) {
  const pages = ctx.PPTImportedLibrary[t.id]?.pages;
  if (!pages?.length) throw new Error(`No pages for ${t.id}`);
  for (const page of pages) {
    if (!ctx.PPTTemplateAssets[page.asset]) throw new Error(`No artwork for ${t.id}/${page.number}`);
    if (!page.elements.every(e => Number.isFinite(e.x) && Number.isFinite(e.y) && e.w > 0 && e.h > 0)) throw new Error(`Bad text bounds for ${t.id}/${page.number}`);
  }
  if (!ctx.PPTTemplates.preview(t, 1).includes('<svg')) throw new Error(`Bad preview for ${t.id}`);
  const slides = ctx.PPTTemplates.build({
    title: '月度工作汇报', brief: '面向管理层的月度工作汇报', answers: ['管理层', '业务与成果', '8 页左右', t.name],
    extras: [], count: 8, uid: (() => { let i = 0; return () => String(++i); })(),
    element: (type, text, x, y, w, h, props) => ({ type, text, x, y, w, h, ...props })
  });
  if (slides.length !== 8 || slides[0].sourcePage !== 1 || slides.at(-1).sourcePage !== pages.length) throw new Error(`Bad generated deck for ${t.id}`);
  if (slides.some(s => !ctx.PPTTemplateAssets[s.elements[0].src])) throw new Error(`Missing generated artwork for ${t.id}`);
  console.log(`${t.name}: ${pages.length} source pages; preview and 8-page generation OK`);
}
