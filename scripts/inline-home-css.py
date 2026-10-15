#!/usr/bin/env python3
"""Re-inline css/style.css into index.html (homepage avoids a render-blocking CSS request).
Run after editing css/style.css: python3 scripts/inline-home-css.py"""
import re
from pathlib import Path
root = Path(__file__).resolve().parent.parent
css = (root / 'css/style.css').read_text()
m = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
m = re.sub(r'\s+', ' ', m)
m = re.sub(r'\s*([{};:,>])\s*', r'\1', m).replace(';}', '}').replace('and(', 'and (').strip()
idx = root / 'index.html'
t = idx.read_text()
t = re.sub(r'<style id="site-css">.*?</style>', lambda _: '<style id="site-css">' + m + '</style>', t, flags=re.S)
idx.write_text(t)
print('inlined', len(m), 'bytes')
