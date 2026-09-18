import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const PARTIALS = path.join(ROOT, 'src/partials');

/** Build-time HTML partials: <!-- @include header --> → src/partials/header.html (zero runtime cost) */
function partials() {
  const cache = new Map();
  const read = (name) => {
    if (!cache.has(name)) cache.set(name, readFileSync(path.join(PARTIALS, `${name}.html`), 'utf8'));
    return cache.get(name);
  };
  const expand = (html, depth = 0) =>
    depth > 5 ? html : html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, n) => expand(read(n), depth + 1));
  return {
    name: 'espresso-partials',
    handleHotUpdate({ file, server }) {
      if (file.startsWith(PARTIALS)) { cache.clear(); server.ws.send({ type: 'full-reload' }); }
    },
    transformIndexHtml: { order: 'pre', handler: (html) => expand(html) },
  };
}

const pages = Object.fromEntries(
  readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => [f.replace(/\.html$/, ''), path.join(ROOT, f)])
);

export default defineConfig({
  plugins: [partials()],
  server: { host: '0.0.0.0', port: 3000, strictPort: true, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 3000, strictPort: true, allowedHosts: true },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: { input: pages, output: { manualChunks: undefined } },
    assetsInlineLimit: 2048,
  },
});
