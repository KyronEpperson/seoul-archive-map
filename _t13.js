const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);const r={};
r.hintAtFit=await p.evaluate(()=>document.getElementById("hint").hidden);
await p.click("#t-list");await p.click(".row:has-text('Kkupdang')");for(let i=0;i<4;i++)await p.click("#zin");await p.waitForTimeout(600);
r.hintZ2=await p.evaluate(()=>({hidden:document.getElementById("hint").hidden,text:document.getElementById("hint").textContent}));
await p.dblclick("#map",{position:{x:380,y:430}});await p.waitForTimeout(600);
r.afterDbl=await p.evaluate(()=>({hidden:document.getElementById("hint").hidden,text:document.getElementById("hint").textContent,labels:[...document.querySelectorAll("#map .pt text")].filter(t=>t.style.display==="block").length}));
console.log(JSON.stringify(r));await b.close();})()
