// file: fetch-tmdb-popular.js
// Node >= 18 (fetch natif)
import fs from "node:fs/promises";

const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjU4ZjA4Y2NlOTY4OGU0OWM5MmUzMzU2MmZmOWE2NiIsIm5iZiI6MTc1ODM3MjY4MS40NTUwMDAyLCJzdWIiOiI2OGNlYTM0OTQ4MTNkYjEwY2ZmZThkNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.14n-ItlCOEKNLo3ul91qkJVqNL_wxtKq7Yn96c3LUXQ"; // v4 "Read Access Token"
if (!TMDB_TOKEN) {
    console.error("TMDB_TOKEN manquant (Bearer v4).");
    process.exit(1);
}

const API = "https://api.themoviedb.org/3/movie/popular";
const params = new URLSearchParams({
    language: "fr-FR",   // adapte si besoin
    region: "FR",        // filtre pays
    page: "1"
});

const res = await fetch(`${API}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}` }
});

if (!res.ok) {
    console.error("TMDB error:", res.status, await res.text());
    process.exit(1);
}

const data = await res.json();
// On garde les 10 premiers + champs utiles (adapte à ton besoin)
const top10 = (data.results ?? []).slice(0, 10).map(m => ({
    id: m.id,
    title: m.title,
    original_title: m.original_title,
    overview: m.overview,
    release_date: m.release_date,
    popularity: m.popularity,
    vote_average: m.vote_average,
    vote_count: m.vote_count,
    poster_path: m.poster_path,      // concatène avec https://image.tmdb.org/t/p/w500
    backdrop_path: m.backdrop_path
}));

await fs.writeFile("popular.json", JSON.stringify(top10, null, 2), "utf-8");
console.log("✅ Écrit popular.json avec", top10.length, "films.");