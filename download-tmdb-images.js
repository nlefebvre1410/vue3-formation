// file: download-tmdb-images.js
// Node >= 18
import fs from "node:fs/promises";
import path from "node:path";

const INPUT = "popular.json";       // ton fichier avec les films
const IMG_BASE = "https://image.tmdb.org/t/p";
const POSTER_SIZE = "w500";         // ou "original"
const BACKDROP_SIZE = "w780";       // ou "original"
const OUT_DIR = "images";           // dossier de sortie

async function downloadImage(url, dest) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur téléchargement ${url} : ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    console.log("✅", dest);
}

async function main() {
    const movies = JSON.parse(await fs.readFile(INPUT, "utf8"));
    await fs.mkdir(OUT_DIR, { recursive: true });

    for (const m of movies) {
        if (m.poster_path) {
            const url = `${IMG_BASE}/${POSTER_SIZE}${m.poster_path}`;
            const dest = path.join(OUT_DIR, `${m.id}_poster.jpg`);
            await downloadImage(url, dest);
        }
        if (m.backdrop_path) {
            const url = `${IMG_BASE}/${BACKDROP_SIZE}${m.backdrop_path}`;
            const dest = path.join(OUT_DIR, `${m.id}_backdrop.jpg`);
            await downloadImage(url, dest);
        }
    }
}

main().catch(console.error);