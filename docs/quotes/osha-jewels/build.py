import json, os, sys, subprocess, pathlib
from jinja2 import Environment, FileSystemLoader

HERE = pathlib.Path(__file__).parent.resolve()
FONTS = (HERE / 'fonts').as_uri()

def inr(n):
    n = int(round(n)); s = str(n)
    if len(s) <= 3: return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:]); head = head[:-2]
    if head: parts.insert(0, head)
    return ','.join(parts) + ',' + tail

def compute(spec):
    for p in spec['b2b']:
        mo = p['term_months']
        one = sum(i['amount'] for i in p['lines'] if i['unit'] == 'one-time')
        monthly = sum(i['amount'] for i in p['lines'] if i['unit'] == 'per month')
        media = sum(i['amount'] * (mo if i['unit']=='per month' else 1) for i in p['lines'] if i.get('media'))
        p['total'] = one + monthly * mo
        p['media_total'] = media
        p['total_label'] = {3:'Three', 6:'Six', 4:'Four', 2:'Two', 1:'One'}[mo] + '-month total'
    r = spec['reels']
    for k in ('direct','indirect'):
        sec = r[k]
        sec['total'] = sum(i['amount'] for i in sec['lines'])
        sec['media_total'] = sum(i['amount'] for i in sec['lines'] if i.get('media'))
    r['total'] = r['direct']['total'] + r['indirect']['total']
    r['media_total'] = r['direct']['media_total'] + r['indirect']['media_total']
    s = spec['summary']
    s['rows'] = [
        {'num': p['num'], 'title': p['title'], 'sub': f"{p['term_label'].split(' minimum')[0]} · includes ₹{inr(p['media_total'])} media", 'total': p['total']} for p in spec['b2b']
    ] + [{'num': r['num'], 'title': r['title'], 'sub': f"Six months · 19 reels · includes ₹{inr(r['media_total'])} boosts", 'total': r['total']}]
    s['grand'] = sum(x['total'] for x in s['rows'])
    s['media'] = sum(p['media_total'] for p in spec['b2b']) + r['media_total']
    s['third'] = sum(i['amount'] for k in ('direct','indirect') for i in r[k]['lines'] if i.get('third'))
    s['consultant'] = s['grand'] - s['media'] - s['third']
    for x in s['split']: x['amount'] = s[x['key']]
    assert s['media'] + s['third'] + s['consultant'] == s['grand']
    assert sum(int(m['n']) for m in r['months']) == 19, 'month counts must sum to 19'
    return spec

def main(out='osha-jewels-quote.pdf'):
    spec = compute(json.load(open(HERE/'spec.json')))
    env = Environment(loader=FileSystemLoader(str(HERE)), autoescape=False)
    env.filters['inr'] = inr
    env.filters['inr_plain'] = lambda n: '₹' + inr(n)
    html = env.get_template('template.html').render(
        m=spec['meta'], c=spec['cover'], g=spec['glance'], b2b=spec['b2b'], r=spec['reels'], s=spec['summary'], t=spec['terms'],
        fonts=FONTS, total_pages=9)
    (HERE/'quote.html').write_text(html)
    subprocess.run(['node', str(HERE/'render.js'), str(HERE/'quote.html'), str(HERE/out)], check=True,
                   env={**os.environ, 'NODE_PATH': '/opt/node22/lib/node_modules'})
    import pymupdf
    d = pymupdf.open(str(HERE/out))
    prev = HERE/'preview'; prev.mkdir(exist_ok=True)
    for f in prev.glob('*.png'): f.unlink()
    txt = []
    for i, pg in enumerate(d, 1):
        pg.get_pixmap(dpi=96).save(str(prev/f'page-{i:02d}.png'))
        txt.append(f'===== PAGE {i} =====\n' + pg.get_text())
    (HERE/'quote.txt').write_text('\n'.join(txt))
    print(f'{out}: {len(d)} pages; totals →', {p['num']: p['total'] for p in spec['b2b']}, 'reels', spec['reels']['total'], 'grand', spec['summary']['grand'], 'media', spec['summary']['media'])
    json.dump(spec, open(HERE/'spec.computed.json','w'), indent=1)

if __name__ == '__main__':
    main(*sys.argv[1:])
