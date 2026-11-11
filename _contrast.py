import re,sys
css=open('seoul-archive.html').read()
def tok(n):
    m=re.search(r'--'+n+r':(#[0-9a-fA-F]{6})',css);return m.group(1)
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)];c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c];return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def cr(a,b):
    la,lb=lum(a),lum(b);return (max(la,lb)+0.05)/(min(la,lb)+0.05)
def lit(sel,prop='fill'):
    m=re.search(r'(?<![\w.-])'+re.escape(sel)+r'\{[^}]*?'+prop+r':(#[0-9a-fA-F]{6}|var\(--[a-z-]+\))',css)
    v=m.group(1);return tok(v[6:-1]) if v.startswith('var') else v
pairs=[ # (name, fg, bg, min)
 ("panel mute text",tok('mute'),'#ffffff',4.5),("panel faint text (as-of, row meta)",tok('faint'),'#ffffff',4.5),
 ("green link/ink",tok('green-ink'),'#ffffff',4.5),("eyebrow eat",tok('eat'),'#ffffff',3.0),
 ("gu label",lit('.lbl'),tok('gu'),3.0),("gu korean tspan",lit('.lbl tspan.ko'),tok('gu'),3.0),
 ("hood korean tspan",lit('.lbl.hood tspan.ko'),tok('gu'),3.0),
 ("park label on park",tok('park-ink'),tok('park'),3.0),("hill label on wood",tok('hill-ink'),tok('hill'),3.0),
 ("stream label on land",lit('.lbl.streamlbl'),tok('gu'),3.0),("expressway label on band",lit('.lbl.expylbl'),tok('expy'),3.0),
 ("road name on land",lit('.lbl.roadname'),tok('gu'),3.0),("river label on water",lit('.lbl.riverlbl'),tok('water'),3.0),
 ("station label",lit('.stlbl'),tok('gu'),3.0),("road label (unused class)",lit('.roadlbl'),tok('gu'),3.0),
]
bad=0
for n,f,b,m in pairs:
    r=cr(f,b);ok=r>=m;bad+=not ok;print(f"{'ok ' if ok else 'BAD'} {r:5.2f}:1 (min {m})  {n:36s} {f} on {b}")
print("failing:",bad)
