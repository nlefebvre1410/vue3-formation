// file: make-local-json.js  (Node >= 18)
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = "popular.json";
const OUTPUT = "movies.local.json";
const IMG_DIR = "images"; // tes images: {id}_poster.jpg et {id}_backdrop.jpg

async function findImage(baseName) {
    // essaie .jpg/.jpeg/.png/.webp
    for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
        const p = path.join(IMG_DIR, baseName + ext);
        try { await fs.access(p); return p; } catch {}
    }
    return null;
}

async function main() {
    const movies = JSON.parse(await fs.readFile(INPUT, "utf8"));

    const out = [];
    for (const m of movies) {
        const posterLocal = await findImage(`${m.id}_poster`);
        const backdropLocal = await findImage(`${m.id}_backdrop`);

        out.push({
            id: m.id,
            title: m.title,
            original_title: m.original_title,
            overview: m.overview,
            release_date: m.release_date,
            popularity: m.popularity,
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            // remplace par chemins locaux si trouvés, sinon garde l’original TMDB
            poster_path: posterLocal ? `./${posterLocal}` : m.poster_path,
            backdrop_path: backdropLocal ? `./${backdropLocal}` : m.backdrop_path,
        });
    }

    await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2), "utf8");
    console.log(`✅ Écrit ${OUTPUT} (${out.length} films)`);
}

main().catch((e) => { console.error(e); process.exit(1); });