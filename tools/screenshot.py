#!/usr/bin/env python3
"""Visual QA — screenshots every page (mobile + desktop, AR + EN) and reports console errors.
   python3 tools/screenshot.py [base_url]   → /tmp/shots/*.png
"""
import sys, os, asyncio
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000'
PAGES = ['/', '/menu.html', '/story.html', '/branches.html', '/gallery.html', '/contact.html', '/404.html']
OUT = '/tmp/shots'; os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errors = []
        for vp, name in [((390, 844), 'm'), ((1440, 900), 'd')]:
            for lang in ['ar', 'en']:
                ctx = await b.new_context(viewport={'width': vp[0], 'height': vp[1]}, device_scale_factor=1, locale='ar-YE' if lang == 'ar' else 'en-US')
                await ctx.add_init_script("sessionStorage.setItem('espresso_seen','1')")
                page = await ctx.new_page()
                page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type in ('error', 'warning') else None)
                page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
                for path in PAGES:
                    url = f'{BASE}{path}?lang={lang}'
                    await page.goto(url, wait_until='networkidle')
                    await page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
                    await page.wait_for_timeout(600)
                    fn = f"{OUT}/{name}-{lang}-{path.strip('/').replace('.html','') or 'home'}.png"
                    await page.screenshot(path=fn, full_page=True)
                    print('✓', fn)
                await ctx.close()
        await b.close()
        print('\n--- console ---'); print('\n'.join(dict.fromkeys(errors)) or 'clean ✓')

asyncio.run(main())
