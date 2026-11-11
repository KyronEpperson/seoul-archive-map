// node bench.js -> frame costs on a phone-sized viewport with 4x CPU throttle
const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:820},deviceScaleFactor:2,hasTouch:true});const p=await ctx.newPage();
const cdp=await ctx.newCDPSession(p);await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
const t0=Date.now();await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForFunction(()=>document.querySelectorAll("#map .pt").length>30);const load=Date.now()-t0;await p.waitForTimeout(1200);
const frames=fn=>p.evaluate(async src=>{const run=new Function("step","return ("+src+")(step)");const d=[];let last=performance.now();const N=40;for(let i=0;i<N;i++){run(i);await new Promise(r=>requestAnimationFrame(r));const n=performance.now();d.push(n-last);last=n;}d.sort((a,c)=>a-c);return {med:+d[N>>1].toFixed(1),p90:+d[Math.floor(N*.9)].toFixed(1),max:+d[N-1].toFixed(1)}},fn.toString());
const svgEv=`const s=document.getElementById("map");const r=s.getBoundingClientRect();`;
const wheel=await frames(new Function("i",svgEv+`s.dispatchEvent(new WheelEvent("wheel",{deltaY:i%20<10?-100:100,clientX:r.left+200,clientY:r.top+250,bubbles:true,cancelable:true}))`));
const pan=await frames(new Function("i",svgEv+`const o={pointerId:7,isPrimary:true,bubbles:true,pointerType:"touch"};if(i===0)s.dispatchEvent(new PointerEvent("pointerdown",{...o,clientX:200,clientY:400}));s.dispatchEvent(new PointerEvent("pointermove",{...o,clientX:200+(i%20)*6,clientY:400+(i%10)*4}));if(i===39)s.dispatchEvent(new PointerEvent("pointerup",{...o,clientX:200,clientY:400}))`));
await p.waitForTimeout(400);
const zoomAnim=await p.evaluate(async()=>{const d=[];let last=performance.now(),go=true;const tick=()=>{const n=performance.now();d.push(n-last);last=n;if(go)requestAnimationFrame(tick)};requestAnimationFrame(tick);document.getElementById("zin").click();await new Promise(r=>setTimeout(r,700));go=false;d.sort((a,c)=>a-c);return {frames:d.length,med:+d[d.length>>1].toFixed(1),max:+d[d.length-1].toFixed(1)}});
const nodes=await p.evaluate(()=>({svgNodes:document.querySelectorAll("#map *").length,pathChars:[...document.querySelectorAll("#map path")].reduce((t,e)=>t+(e.getAttribute("d")||"").length,0)}));
console.log(JSON.stringify({loadMs:load,wheel,pan,zoomAnim,...nodes}));await b.close()})();
