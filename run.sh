#!/bin/bash
# run.sh mode1 mode2 ... -> prints metrics, writes _review.png side by side (cropped to map+panel)
cd "$(dirname "$0")"; rm -f _m_*.png
for m in "$@"; do node harness.js "$m" "_m_$(echo "$m"|tr -c "a-zA-Z0-9-\n" _).png"; done
python3 - "$@" <<'PY'
import sys;from PIL import Image
import re;ims=[Image.open('_m_'+re.sub(r'[^a-zA-Z0-9-]','_',m)+'.png') for m in sys.argv[1:]]
W=sum(i.width for i in ims);H=max(i.height for i in ims);o=Image.new('RGB',(W,H));x=0
for i in ims:o.paste(i,(x,0));x+=i.width
o.save('_review.png')
PY
