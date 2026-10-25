// Exporte le showreel de /labo/showreel en MP4, image par image : chaque image est
// calculée à l'instant exact, donc aucune saccade, quelle que soit la machine.
//
// Prérequis : serveur de dev lancé (pnpm dev), Google Chrome (Chromium seul ne lit
// pas le H.264), ffmpeg dans le PATH, playwright-core (celui de @playwright/cli
// installé en global ; sinon chemin dans la variable PLAYWRIGHT_CORE).
//
// node scripts/export-showreel.mjs                     → showreel.mp4, 1080p, 30 i/s
// node scripts/export-showreel.mjs --scale 2 --fps 60  → 4K, 60 i/s
// node scripts/export-showreel.mjs --at 3.5,15,28      → images fixes PNG, pour relire
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:4321" },
    fps: { type: "string", default: "30" },
    scale: { type: "string", default: "1" },
    out: { type: "string", default: "showreel.mp4" },
    at: { type: "string" },
  },
});

const PLAYWRIGHT_CORE =
  process.env.PLAYWRIGHT_CORE ?? path.join(process.env.APPDATA ?? "", "npm", "node_modules", "@playwright", "cli", "node_modules", "playwright-core");
const { chromium } = createRequire(import.meta.url)(PLAYWRIGHT_CORE);

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: Number(args.scale) });
page.on("pageerror", (error) => console.error("Erreur dans la page :", error.message));
// Coupe le rechargement à chaud du serveur de dev : une modification de fichier
// pendant l'export rechargerait la page et casserait la capture. Le socket est
// simulé et reste muet.
await page.routeWebSocket(/./, () => {});
await page.goto(`${args.url}/labo/showreel?export`, { waitUntil: "load" });
await page.evaluate(() => window.__showreel.ready);
const seek = (t) => page.evaluate((time) => window.__showreel.seek(time), t);

if (args.at) {
  for (const t of args.at.split(",").map(Number)) {
    await seek(t);
    const file = `showreel-${t}.png`;
    await writeFile(file, await page.screenshot({ type: "png" }));
    console.log(file);
  }
} else {
  await exportVideo();
}
await browser.close();

async function exportVideo() {
  const fps = Number(args.fps);
  const duration = await page.evaluate(() => window.__showreel.duration);
  const total = Math.round(duration * fps);
  const encoder = spawn(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", args.out],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise((resolve) => encoder.on("close", resolve));

  for (let frame = 0; frame < total; frame++) {
    await seek(frame / fps);
    const png = await page.screenshot({ type: "png" });
    if (!encoder.stdin.write(png)) await new Promise((resolve) => encoder.stdin.once("drain", resolve));
    if (frame % fps === 0) process.stdout.write(`\r${Math.round(frame / fps)} / ${Math.round(duration)} s`);
  }
  encoder.stdin.end();
  await done;
  console.log(`\n${args.out} : ${total} images, ${fps} i/s`);
}
