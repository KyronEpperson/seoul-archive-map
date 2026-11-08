const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:820},hasTouch:true,isMobile:true});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);const r={};
const vb=()=>p.evaluate(()=>document.getElementById("map").getAttribute("viewBox").split(" ").map(Number));
// pinch via synthetic pointer events (two pointers)
const before=await vb();
await p.evaluate(()=>{const s=document.getElementById("map");const ev=(t,id,x,y)=>s.dispatchEvent(new PointerEvent(t,{pointerId:id,clientX:x,clientY:y,bubbles:true,pointerType:"touch"}));
  ev("pointerdown",1,150,300);ev("pointerdown",2,250,300);for(let i=0;i<10;i++){ev("pointermove",1,150-i*5,300);ev("pointermove",2,250+i*5,300);}ev("pointerup",1,100,300);ev("pointerup",2,300,300);});
const after=await vb();r.pinchZoomsIn=after[2]<before[2]*0.8;
// tap with 2px wobble on a point should still select
const pt=await p.evaluate(()=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label").startsWith("Seokchon"));const c=g.querySelector("circle.core").getBoundingClientRect();return {x:c.x+c.width/2,y:c.y+c.height/2}});
await p.evaluate(({x,y})=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label").startsWith("Seokchon"));const ev=(t,el,dx,dy)=>el.dispatchEvent(new PointerEvent(t,{pointerId:3,clientX:x+dx,clientY:y+dy,bubbles:true,pointerType:"touch"}));ev("pointerdown",g,0,0);ev("pointermove",g,1,1);ev("pointermove",g,2,1);ev("pointerup",g,2,1);g.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:x+2,clientY:y+1}));},pt);
await p.waitForTimeout(200);r.wobbleTapSelects=await p.evaluate(()=>!!document.querySelector("#map .pt.sel"));
// a real drag (30px) then release over a point must NOT select
await p.keyboard.press("Escape");await p.waitForTimeout(100);r.clearedBeforeDrag=await p.evaluate(()=>document.querySelectorAll("#map .pt.sel").length===0);await p.evaluate(({x,y})=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label").startsWith("Seokchon"));const s=document.getElementById("map");const ev=(t,el,dx,dy)=>el.dispatchEvent(new PointerEvent(t,{pointerId:4,clientX:x+dx,clientY:y+dy,bubbles:true,pointerType:"touch"}));ev("pointerdown",s,-30,-30);for(let i=0;i<10;i++)ev("pointermove",s,-30+i*3,-30+i*3);ev("pointerup",g,0,0);g.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:x,clientY:y}));},pt);
r.dragDoesNotSelect=await p.evaluate(()=>document.querySelectorAll("#map .pt.sel").length)===0;
// touch-action set so browser doesn't hijack
r.touchAction=await p.evaluate(()=>getComputedStyle(document.getElementById("mapwrap")).touchAction);
// panel scroll vs map: panel scrollable on phone?
await p.click("#t-queue");r.panelScrolls=await p.evaluate(()=>{const e=document.getElementById("panel");return e.scrollHeight>e.clientHeight&&getComputedStyle(e).overflowY!=="hidden"});
console.log(JSON.stringify(r));await b.close();})()
