const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);
await p.click("#t-list");await p.click(".row:has-text('Kkupdang')");for(let i=0;i<4;i++)await p.click("#zin");await p.waitForTimeout(200);
const r=await p.evaluate(async()=>{const svg=document.getElementById("map");const t0=performance.now();let n=0;
  for(let i=0;i<60;i++){svg.dispatchEvent(new PointerEvent("pointerdown",{clientX:500,clientY:400,pointerId:1,bubbles:true}));svg.dispatchEvent(new PointerEvent("pointermove",{clientX:500+i,clientY:400+i,pointerId:1,bubbles:true}));svg.dispatchEvent(new PointerEvent("pointerup",{clientX:500+i,clientY:400+i,pointerId:1,bubbles:true}));n++;await new Promise(r=>requestAnimationFrame(r));}
  return {msPerPan:((performance.now()-t0)/n).toFixed(1),nodes:document.querySelectorAll("#map *").length};});
const q=await p.evaluate(async()=>{const t0=performance.now();document.getElementById("t-queue").click();await new Promise(r=>setTimeout(r,0));return {queueRenderMs:(performance.now()-t0).toFixed(1),rows:document.querySelectorAll(".qrow").length,panelNodes:document.querySelectorAll("#pbody *").length}});
console.log(JSON.stringify({...r,...q}));await b.close();})()
