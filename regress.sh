#!/bin/bash
# full regression: harness views + scripted suites; prints one line per check, exit 1 on any failure
cd "$(dirname "$0")"; fail=0
./run.sh desk-fit phone-fit desk-z1 desk-z2 phone-z2 queue list apps 2>/dev/null | python3 -c "
import sys,json
for l in sys.stdin:
    if not l.startswith('{'):continue
    r=json.loads(l);bad=[]
    if r['log']:bad.append('errors:'+str(r['log'])[:80])
    if r['labelOverlaps']:bad.append('overlaps:'+str(r['overlapPairs'][:3]))
    if r['hscroll']:bad.append('hscroll')
    if r['panelOverflowX']:bad.append('panelOverflowX')
    if r['smallTaps']:bad.append('smallTaps:'+str(r['smallTaps'][:4]))
    if r['mode'].startswith('phone') and r['headerH']>80:bad.append('header:'+str(r['headerH']))
    if r['mode'].startswith('phone') and r['mapH']<380:bad.append('mapH:'+str(r['mapH']))
    print(('FAIL ' if bad else 'ok   ')+r['mode'].ljust(10)+' '+' '.join(bad))
    if bad:sys.exit(1)" || fail=1
node validate.js || fail=1
for t in _t6.js _t8.js _t14.js _t16.js; do out=$(node $t 2>/dev/null | tr -d '\n '); if echo "$out" | grep -q 'false'; then echo "FAIL $t $out"; fail=1; else echo "ok   $t"; fi; done
exit $fail
