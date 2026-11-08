const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);const r={};
// chip toggle hides points
await p.click('.chip[data-cat="shop"]');r.shopDimmed=await p.evaluate(()=>[...document.querySelectorAll('#map .pt')].filter(g=>g.style.getPropertyValue('--c').includes('shop')).every(g=>g.classList.contains('dim')));
r.listExcludesShop=await (async()=>{await p.click('#t-list');return await p.evaluate(()=>![...document.querySelectorAll('.row')].some(r=>r.style.getPropertyValue('--c').includes('shop')))})();
await p.click('.chip[data-cat="shop"]');
// dimmed point still clickable? (should NOT select when its category is off)
await p.click('.chip[data-cat="art"]');await p.click('#t-list');r.artHiddenFromList=await p.evaluate(()=>![...document.querySelectorAll('.row')].some(r=>r.style.getPropertyValue('--c').includes('art')));
r.dimPointClickable=await p.evaluate(()=>{const g=[...document.querySelectorAll('#map .pt.dim')][0];return g?getComputedStyle(g).pointerEvents:'none-found'});
await p.click('.chip[data-cat="art"]');
// keyboard: can Tab reach a map point?
r.ptsFocusable=await p.evaluate(()=>[...document.querySelectorAll('#map .pt')].some(g=>g.hasAttribute('tabindex')));
// fit after deep zoom restores
await p.click('#t-list');await p.click(".row:has-text('Kkupdang')");for(let i=0;i<5;i++)await p.click('#zin');const z=await p.evaluate(()=>document.getElementById('world').getAttribute('class'));await p.click('#zfit');r.fitRestores=(await p.evaluate(()=>document.getElementById('world').getAttribute('class')))==='z0'&&z==='z2';
// select → ring + label visible at z0?
r.selLabelAtFit=await p.evaluate(()=>{const t=document.querySelector('#map .pt.sel text');return t&&getComputedStyle(t).display!=='none'});
// Escape clears selection?
await p.keyboard.press('Escape');r.escClears=await p.evaluate(()=>!document.querySelector('#map .pt.sel'));
// reduced-motion honoured
const p2=await b.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});await p2.goto("http://127.0.0.1:8765/seoul-archive.html");await p2.waitForTimeout(500);r.reducedMotionStopsPulse=await p2.evaluate(()=>getComputedStyle(document.querySelector('#map .pt circle.halo')).animationName==='none');
// ARIA on chips
r.chipsHaveRole=await p.evaluate(()=>[...document.querySelectorAll('.chip')].every(c=>c.getAttribute('aria-pressed')));
// tab panel announces
r.tabsHaveControls=await p.evaluate(()=>document.querySelector('[role=tab]').getAttribute('aria-controls'));
console.log(JSON.stringify(r,null,1));await b.close();})()
