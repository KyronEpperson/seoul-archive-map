global.window={};require("./places.js");require("./basemap.js");
const P=window.PLACES,A=window.AREAS,B=window.BASE;const err=[];const ids=new Set();
const CATS=new Set(["eat","shop","art","see"]);
for(const p of P){const w=m=>err.push(p.id+": "+m);
  if(!p.id||!/^[a-z0-9-]+$/.test(p.id))w("bad id");if(ids.has(p.id))w("duplicate id");ids.add(p.id);
  if(!p.name)w("no name");if(!CATS.has(p.cat))w("bad cat "+p.cat);if(!p.area)w("no area");
  if(typeof p.lat!=="number"||typeof p.lng!=="number")w("lat/lng not numbers");
  const inSeoul=p.lat>37.42&&p.lat<37.70&&p.lng>126.76&&p.lng<127.20,inJeju=p.lat>33.1&&p.lat<33.6&&p.lng>126.1&&p.lng<127.0;
  if(!inSeoul&&!inJeju)w("coords outside Seoul/Jeju");if(inJeju&&!p.jeju)w("in Jeju but jeju flag missing");if(inSeoul&&p.jeju)w("jeju flag on Seoul point");
  if(p.until&&!/^\d{4}-\d{2}-\d{2}$/.test(p.until))w("bad until");if(p.ended&&!p.until)w("ended without until");
  if(!p.src||!p.src.acct||!p.src.plat||!p.src.date)w("incomplete src");if(p.src&&!/^\d{4}-\d{2}-\d{2}$/.test(p.src.date))w("bad src date");
  if(p.order&&!Array.isArray(p.order))w("order not array");for(const [k,val] of Object.entries(p))if(typeof val==="string"&&/^(—|-|n\/a|tbd|\?)$/i.test(val.trim()))w("placeholder in "+k);}
if(!A.length||!A.every(a=>a.length===3))err.push("AREAS malformed");
for(const L of B.lines){if(!/^#[0-9A-F]{6}$/i.test(L.c))err.push("line "+L.id+" bad colour");for(const s of L.s)if(s.length!==3||typeof s[1]!=="number")err.push("line "+L.id+" bad station "+JSON.stringify(s));}
if(err.length){console.log("FAIL validate\n  "+err.join("\n  "));process.exit(1)}console.log("ok   validate ("+P.length+" places, "+B.lines.reduce((n,l)=>n+l.s.length,0)+" stations)");
