const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);
await p.click("#t-list");await p.click(".row:has-text('Kkupdang')");for(let i=0;i<4;i++)await p.click("#zin");await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const svg=document.getElementById("map");const t0=performance.now();
  svg.dispatchEvent(new PointerEvent("pointerdown",{clientX:500,clientY:400,pointerId:1,bubbles:true}));
  for(let i=0;i<200;i++)svg.dispatchEvent(new PointerEvent("pointermove",{clientX:500+i,clientY:400+(i%7),pointerId:1,bubbles:true}));
  const t1=performance.now();svg.dispatchEvent(new PointerEvent("pointerup",{clientX:700,clientY:400,pointerId:1,bubbles:true}));
  return {msPerMove:((t1-t0)/200).toFixed(2)};});
console.log(JSON.stringify(r));await b.close();})()
