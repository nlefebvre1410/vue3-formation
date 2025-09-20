// file: fetch-tmdb-images.js  (Node >= 18)
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = "popular.json";
const OUTPUT = "popular_with_images.json";
const IMG_BASE = "https://image.tmdb.org/t/p";
const SIZE_POSTER = process.env.SIZE_POSTER || "w500";
const SIZE_BACKDROP = process.env.SIZE_BACKDROP || "w780";

const dirPosters = path.join("images", "posters");
const dirBackdrops = path.join("images", "backdrops");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function download(url, outPath, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        const res = await fetch(url);
        if (res.ok) {
            const buf = Buffer.from(await res.arrayBuffer());
            await fs.writeFile(outPath, buf);
            return true;
        }
        if (i < retries) await sleep(500 * (i + 1));
    }
    return false;
}

function fullUrl(size, p) {
    if (!p) return null;
    return `${IMG_BASE}/${size}${p}`;
}

function fileName(id, size, p) {
    const ext = path.extname(p || ".jpg") || ".jpg";
    return `${id}_${size}${ext}`;
}

async function main() {
    const movies = JSON.parse(await fs.readFile(INPUT, "utf8"));
    await fs.mkdir(dirPosters, { recursive: true });
    await fs.mkdir(dirBackdrops, { recursive: true });

    // Limite de concurrence simple
    const MAX_CONCURRENCY = 5;
    let active = 0;
    const queue = [];

    const run = (fn) =>
        new Promise((resolve) => {
            const tryRun = async () => {
                if (active >= MAX_CONCURRENCY) return setTimeout(tryRun, 25);
                active++;
                try {
                    resolve(await fn());
                } finally {
                    active--;
                }
            };
            tryRun();
        });

    const enriched = movies.map((m) => {
        const poster_url = fullUrl(SIZE_POSTER, m.poster_path);
        const backdrop_url = fullUrl(SIZE_BACKDROP, m.backdrop_path);

        if (poster_url) {
            const out = path.join(dirPosters, fileName(m.id, SIZE_POSTER, m.poster_path));
            queue.push(() => download(poster_url, out));
        }
        if (backdrop_url) {
            const out = path.join(dirBackdrops, fileName(m.id, SIZE_BACKDROP, m.backdrop_path));
            queue.push(() => download(backdrop_url, out));
        }

        return { ...m, poster_url, backdrop_url };
    });

    // Exécute la file
    await Promise.all(queue.map(job => run(job)));

    await fs.writeFile(OUTPUT, JSON.stringify(enriched, null, 2), "utf8");
    console.log("✅ Fini. Images dans ./images/, JSON enrichi ->", OUTPUT);
}

main().catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
});