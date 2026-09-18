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

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const HANDLE = 'espre__sso';
const OUT = path.join(ROOT, 'src/data/instagram-live.json');
const IMG_DIR = path.join(ROOT, 'assets/source/ig/feed');
const WANT_IMAGES = process.argv.includes('--images');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const known = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf8')) : { profile: {}, posts: [] };
const seed = JSON.parse(await readFile(path.join(ROOT, 'src/data/instagram-scrape.json'), 'utf8'));

const get = async (url, as = 'text') => {
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return as === 'json' ? r.json() : as === 'buffer' ? Buffer.from(await r.arrayBuffer()) : r.text();
};

/* 1 — profile embed (best-effort) */
let profile = { ...seed.brand, ...known.profile };
let embedPosts = [];
try {
  const html = await get(`https://www.instagram.com/${HANDLE}/embed/`);
  const m = html.match(/contextJSON\\?":\\?"((?:[^"\\]|\\.)*)"/);
  if (m) {
    const ctx = JSON.parse(JSON.parse(`"${m[1]}"`)).context;
    profile = {
      ...profile,
      full_name_raw: ctx.full_name ?? profile.full_name_raw,
      followers: ctx.follower_count ?? ctx.edge_followed_by?.count ?? profile.followers,
      posts_count: ctx.media_count ?? ctx.edge_owner_to_timeline_media?.count ?? profile.posts_count,
      profile_pic_url: ctx.profile_pic_url ?? profile.profile_pic_url,
      synced_profile_at: new Date().toISOString(),
    };
    embedPosts = (ctx.edge_owner_to_timeline_media?.edges ?? []).map(({ node }) => ({
      shortcode: node.shortcode,
      is_video: node.is_video,
      taken_at: node.taken_at_timestamp,
      likes: node.edge_liked_by?.count ?? node.edge_media_preview_like?.count,
      comments: node.edge_media_to_comment?.count,
      caption: node.edge_media_to_caption?.edges?.[0]?.node?.text ?? '',
      display_url: node.display_url,
    }));
    console.log(`✓ embed: ${embedPosts.length} posts, ${profile.followers} followers`);
  } else console.log('· embed: no contextJSON (login-walled today) — using oEmbed only');
} catch (e) {
  console.log(`· embed unavailable: ${e.message}`);
}

/* 2 — oEmbed per shortcode */
const shortcodes = [...new Set([...embedPosts, ...known.posts, ...seed.posts].map((p) => p.shortcode))];
const posts = [];
for (const sc of shortcodes) {
  const prev = { ...(seed.posts.find((p) => p.shortcode === sc) ?? {}), ...(known.posts.find((p) => p.shortcode === sc) ?? {}), ...(embedPosts.find((p) => p.shortcode === sc) ?? {}) };
  try {
    const o = await get(`https://www.instagram.com/api/v1/oembed/?url=https://www.instagram.com/p/${sc}/`, 'json');
    prev.caption = o.title ?? prev.caption;
    prev.thumbnail_url = o.thumbnail_url;
    prev.thumbnail_w = o.thumbnail_width;
    prev.thumbnail_h = o.thumbnail_height;
    prev.author_id = o.author_id;
    prev.synced_at = new Date().toISOString();
    if (WANT_IMAGES && o.thumbnail_url) {
      await mkdir(IMG_DIR, { recursive: true });
      const file = path.join(IMG_DIR, `${sc}.jpg`);
      await writeFile(file, await get(o.thumbnail_url, 'buffer'));
      prev.local = `ig/feed/${sc}`;
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
