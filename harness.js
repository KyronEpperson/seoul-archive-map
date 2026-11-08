// usage: node harness.js <mode> [out]   modes: desk-fit desk-z1 desk-z2 phone-fit phone-z2 queue apps list form
const {chromium}=require("playwright");const mode=process.argv[2]||"desk-fit",out=process.argv[3]||"_"+mode.replace(/[^a-z0-9-]/gi,"_")+".png";
(async()=>{const b=await chromium.launch();const phone=mode.startsWith("phone");
const p=await b.newPage({viewport:phone?{width:400,height:820}:{width:1280,height:800},hasTouch:phone,deviceScaleFactor:1});
const log=[];p.on("pageerror",e=>log.push("PAGEERR "+e.message));p.on("console",m=>{if(m.type()==="error"&&!/TUNNEL/.test(m.text()))log.push("CONSOLE "+m.text())});
await p.addInitScript(()=>{const store={};const snaps=[];const col={doc:id=>({set:async d=>{store[id]=d;snaps.forEach(f=>f())},delete:async()=>{delete store[id];snaps.forEach(f=>f())}}),onSnapshot:(next)=>{const fire=()=>next({docs:Object.keys(store).map(id=>({id,exists:true,data:()=>store[id]}))});snaps.push(fire);setTimeout(fire,50);return()=>{}}};window.claude={use:async n=>n==="db"?{collection:()=>col}:n==="user"?{can:async()=>true}:null};});
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(900);
const zoomTo=async(n)=>{for(let i=0;i<n;i++)await p.click("#zin");await p.waitForTimeout(250)};
if(mode.endsWith("z1")){await p.click("#t-list");await p.click(".row:has-text('Namdaemun')");await zoomTo(2);await p.click("#t-place");}
if(mode.endsWith("z2")){await p.click("#t-list");await p.click(".row:has-text('Kkupdang')");await zoomTo(4);}
if(mode.endsWith("queue")){await p.click("#t-queue");}
if(mode.endsWith("apps")){await p.click("#t-extra");}
if(mode.endsWith("list")){await p.click("#t-list");}
if(mode.startsWith("sel:")){const n=mode.slice(4).split("|")[0];await p.click("#t-list");await p.click(".row:has-text('"+n+"')");}
if(mode.endsWith("form")){await p.click("#t-queue");await p.click(".tagbtn[data-id]");await p.fill("#tf-name","Test cafe");}
await p.waitForTimeout(700);
const m=await p.evaluate(()=>{const r={};const W=document.documentElement.clientWidth;r.hscroll=document.documentElement.scrollWidth>W||document.body.scrollWidth>W;
  const texts=[...document.querySelectorAll("#map text")].filter(t=>t.getClientRects().length&&getComputedStyle(t).display!=="none"&&getComputedStyle(t).opacity!=="0").map(t=>{const b=t.getBoundingClientRect();return {t:t.textContent,x:b.x,y:b.y,w:b.width,h:b.height,c:t.getAttribute("class")||t.parentNode.getAttribute("class")||""}});
  let ov=0,pairs=[];for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],c=texts[j];if(a.w&&c.w&&!(a.x+a.w<c.x||c.x+c.w<a.x||a.y+a.h<c.y||c.y+c.h<a.y)){ov++;if(pairs.length<6)pairs.push(a.t+" × "+c.t)}}
  r.labelOverlaps=ov;r.overlapPairs=pairs;r.visibleLabels=texts.length;
  const mp=document.getElementById("mapwrap").getBoundingClientRect();r.labelsOffMap=texts.filter(t=>t.x<mp.left||t.x+t.w>mp.right||t.y<mp.top||t.y+t.h>mp.bottom).length;
  r.smallTaps=[...document.querySelectorAll("button,a,[role=tab]")].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.height&&(b.width<32||b.height<32)}).map(e=>(e.textContent||e.getAttribute("aria-label")||"").trim().slice(0,18)).slice(0,8);
  r.zoomClass=document.getElementById("world").getAttribute("class");r.panelOverflowX=document.getElementById("panel").scrollWidth>document.getElementById("panel").clientWidth;
  const t=document.querySelector("#t-place[aria-selected=true]")?"place":"other";r.panelText=document.getElementById("pbody").innerText.slice(0,160).replace(/\n+/g," | ");
  r.pts=document.querySelectorAll("#map .pt").length;r.headerH=document.querySelector("header").getBoundingClientRect().height|0;r.mapH=document.getElementById("mapwrap").getBoundingClientRect().height|0;r.fontsLoaded=document.fonts.check("12px 'Barlow Condensed'");return r;});
console.log(JSON.stringify({mode,log,...m}));
await p.screenshot({path:out});await b.close();})().catch(e=>{console.log("HARNESS FAIL",e.message);process.exit(1)});
