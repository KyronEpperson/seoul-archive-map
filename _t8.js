const {chromium}=require("playwright");(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});const r={};
await p.addInitScript(()=>{const store={};const snaps=[];window.__store=store;const col={doc:id=>({set:async d=>{store[id]=d;snaps.forEach(f=>f())},delete:async()=>{delete store[id];snaps.forEach(f=>f())}}),onSnapshot:(next)=>{const fire=()=>next({docs:Object.keys(store).map(id=>({id,exists:true,data:()=>store[id]}))});snaps.push(fire);setTimeout(fire,50);return()=>{}}};window.claude={use:async n=>n==="db"?{collection:()=>col}:n==="user"?{can:async()=>true}:null};});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(800);
await p.click("#t-queue");await p.click(".tagbtn[data-id]");
// empty name submit blocked?
await p.click("#tf .save");await p.waitForTimeout(200);r.emptyBlocked=await p.evaluate(()=>Object.keys(window.__store).length===0&&!!document.querySelector("#tf"));
await p.fill("#tf-name","Cafe A");await p.selectOption("#tf-area","Hongdae");await p.selectOption("#tf-cat","eat");await p.click("#tf .save");await p.waitForTimeout(300);
r.saved=await p.evaluate(()=>Object.keys(window.__store).length===1);
r.rowShowsTag=await p.evaluate(()=>!!document.querySelector(".qrow .tagged"));
r.tagRowFirst=await p.evaluate(()=>{const rows=[...document.querySelectorAll(".qrow")];return rows.findIndex(x=>x.querySelector(".tagged"))});
// edit
await p.click(".tagbtn[data-id]");r.editPrefilled=await p.inputValue("#tf-name");await p.fill("#tf-name","Cafe B");await p.click("#tf .save");await p.waitForTimeout(300);r.edited=await p.evaluate(()=>window.__store[Object.keys(window.__store)[0]].name);
// tagged point gets its chosen category colour or grey?
r.tagPointColor=await p.evaluate(()=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label")==="Cafe B");return g&&g.style.getPropertyValue("--c")});
// filter: toggling Eat off — does the tagged eat point dim?
await p.click('.chip[data-cat="eat"]');r.tagDimsWithEat=await p.evaluate(()=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label")==="Cafe B");return g&&g.classList.contains("dim")});
r.tagDimsWithTagged=await (async()=>{await p.click('.chip[data-cat="eat"]');await p.click('.chip[data-cat="tag"]');return await p.evaluate(()=>{const g=[...document.querySelectorAll("#map .pt")].find(g=>g.getAttribute("aria-label")==="Cafe B");return g&&g.classList.contains("dim")})})();
await p.click('.chip[data-cat="tag"]');
// drill-down for tagged: has area, note, source, edit button
await p.click("#t-list");await p.click(".row:has-text('Cafe B')");r.drill=await p.evaluate(()=>document.getElementById("pbody").innerText.replace(/\n+/g," | ").slice(0,200));
// remove
await p.click("#retag");await p.waitForTimeout(200);await p.click("#tf-del");await p.waitForTimeout(300);r.removed=await p.evaluate(()=>Object.keys(window.__store).length===0);
// cancel leaves nothing
await p.click(".tagbtn[data-id]");await p.fill("#tf-name","X");await p.click("#tf-x");r.cancelClean=await p.evaluate(()=>!document.querySelector("#tf")&&Object.keys(window.__store).length===0);
// grey ones at z0 get labels? (should not clutter)
console.log(JSON.stringify(r,null,1));await b.close();})()
