// node zoomshot.js out.png [zoomOut clicks] [viewport w h] -> screenshot after zooming out N times
const {chromium}=require("playwright");const [out,n="0",w="1280",h="800"]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h}});const log=[];p.on("pageerror",e=>log.push(e.message));
await p.goto("http://127.0.0.1:8765/seoul-archive.html");await p.waitForTimeout(700);for(let i=0;i<+n;i++){await p.click("#zout");await p.waitForTimeout(150)}await p.waitForTimeout(400);
await p.screenshot({path:out});console.log(JSON.stringify({log}));await b.close()})();
