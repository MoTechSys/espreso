#!/usr/bin/env node
/**
 * Instagram sync — pulls the latest public data for @espre__sso WITHOUT login.
 *
 * Strategy (all public, no credentials):
 *   1. /<user>/embed/          → profile header + 6 latest posts (contextJSON) — when Instagram serves it
 *   2. /api/v1/oembed/?url=…   → caption/title + thumbnail (640w) per known shortcode  ✅ always works
 *   3. Downloads new thumbnails to assets/source/ig/feed/<shortcode>.jpg
 *   4. Writes src/data/instagram-live.json (merged with known posts, never loses data)
 *
 *   node tools/sync-instagram.mjs           # sync
 *   node tools/sync-instagram.mjs --images  # sync + download thumbnails (then run build-images)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const HANDLE = 'espre__sso';
const OUT = path.join(ROOT, 'src/data/instagram-live.json');
const IMG_DIR = path.join(ROOT, 'assets/source/ig/feed');
const WANT_IMAGES = process.argv.includes('--images');
/* The Instagram app UA reliably gets the server-rendered embed (contextJSON) without login */
const UA = 'Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100; en_US; 458229258)';
const UA_WEB = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const known = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf8')) : { profile: {}, posts: [] };
const seed = JSON.parse(await readFile(path.join(ROOT, 'src/data/instagram-scrape.json'), 'utf8'));

const get = async (url, as = 'text', ua = UA) => {
  const r = await fetch(url, { headers: { 'user-agent': ua, accept: '*/*' }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return as === 'json' ? r.json() : as === 'buffer' ? Buffer.from(await r.arrayBuffer()) : r.text();
};

/** Extract contextJSON (a JSON string nested inside the page's JSON) */
function parseContext(html) {
  const i = html.indexOf('contextJSON');
  if (i < 0) return null;
  const j = html.indexOf('"', i + 'contextJSON'.length + 1);
  // walk the escaped string to its closing quote
  let k = j + 1, out = '';
  while (k < html.length) {
    const ch = html[k];
    if (ch === '\\') { out += ch + html[k + 1]; k += 2; continue; }
    if (ch === '"') break;
    out += ch; k++;
  }
  return JSON.parse(JSON.parse(`"${out}"`)).context;
}

/* 1 — profile embed */
let profile = { ...seed.brand, ...known.profile };
let embedPosts = [];
try {
  const html = await get(`https://www.instagram.com/${HANDLE}/embed/?cr=1&v=14`);
  const ctx = parseContext(html);
  if (ctx) {
    profile = {
      ...profile,
      full_name_raw: ctx.full_name ?? profile.full_name_raw,
      followers: Number(ctx.followers_count ?? profile.followers),
      posts_count: Number(ctx.posts_count ?? profile.posts_count),
      profile_pic_url: ctx.profile_pic_url ?? profile.profile_pic_url,
      owner_id: ctx.owner_id ?? profile.owner_id,
      synced_profile_at: new Date().toISOString(),
    };
    embedPosts = (ctx.graphql_media ?? []).map(({ shortcode_media: n }) => ({
      shortcode: n.shortcode,
      is_video: n.__typename === 'GraphVideo' || n.is_video,
      taken_at: n.taken_at_timestamp,
      likes: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count,
      comments: n.edge_media_to_comment?.count,
      caption: n.edge_media_to_caption?.edges?.[0]?.node?.text ?? '',
      display_url: n.display_url,
      width: n.dimensions?.width, height: n.dimensions?.height,
    }));
    console.log(`✓ embed: ${embedPosts.length} posts · ${profile.followers} followers · ${profile.posts_count} total posts`);
    if (WANT_IMAGES && profile.profile_pic_url) {
      await mkdir(path.join(ROOT, 'assets/brand'), { recursive: true });
      await writeFile(path.join(ROOT, 'assets/brand/avatar-150.jpg'), await get(profile.profile_pic_url, 'buffer', UA_WEB));
    }
  } else console.log('· embed: no contextJSON today — using oEmbed only');
} catch (e) {
  console.log(`· embed unavailable: ${e.message}`);
}

/* 2 — oEmbed per shortcode */
const shortcodes = [...new Set([...embedPosts, ...known.posts, ...seed.posts].map((p) => p.shortcode))];
const posts = [];
for (const sc of shortcodes) {
  const prev = { ...(seed.posts.find((p) => p.shortcode === sc) ?? {}), ...(known.posts.find((p) => p.shortcode === sc) ?? {}), ...(embedPosts.find((p) => p.shortcode === sc) ?? {}) };
  try {
    const o = await get(`https://www.instagram.com/api/v1/oembed/?url=https://www.instagram.com/p/${sc}/`, 'json', UA_WEB);
    prev.caption = o.title ?? prev.caption;
    prev.thumbnail_url = o.thumbnail_url;
    prev.thumbnail_w = o.thumbnail_width;
    prev.thumbnail_h = o.thumbnail_height;
    prev.author_id = o.author_id;
    prev.synced_at = new Date().toISOString();
    if (WANT_IMAGES) {
      await mkdir(IMG_DIR, { recursive: true });
      const file = path.join(IMG_DIR, `${sc}.jpg`);
      // Prefer the largest source: embed display_url (full-res for images) vs oEmbed 640w thumbnail.
      // Never overwrite an existing local file with a smaller one.
      const candidates = [prev.display_url, o.thumbnail_url].filter(Boolean);
      let best = null;
      for (const u of candidates) {
        try { const buf = await get(u, 'buffer', UA_WEB); const meta = await sharp(buf).metadata(); if (!best || meta.width > best.w) best = { buf, w: meta.width }; } catch {}
      }
      if (best) {
        let keep = true;
        if (existsSync(file)) { try { keep = (await sharp(file).metadata()).width < best.w; } catch {} }
        if (keep) await writeFile(file, best.buf);
      }
      if (existsSync(file)) prev.local = `ig/feed/${sc}`;
    }
    console.log(`✓ ${sc} ${prev.is_video ? '🎬' : '🖼️ '} ${String(prev.caption).split('\n')[0].slice(0, 50)}`);
  } catch (e) {
    console.log(`✗ ${sc}: ${e.message}`);
  }
  prev.url = `https://www.instagram.com/${prev.is_video ? 'reel' : 'p'}/${sc}/`;
  posts.push(prev);
}
posts.sort((a, b) => (b.taken_at ?? 0) - (a.taken_at ?? 0));

await writeFile(OUT, JSON.stringify({ handle: HANDLE, synced_at: new Date().toISOString(), profile, posts }, null, 2));
console.log(`\n→ ${path.relative(ROOT, OUT)} (${posts.length} posts)${WANT_IMAGES ? '\n→ run: node tools/build-images.mjs' : ''}`);
