// Compresseur d'images, entièrement dans le navigateur : chaque image est redessinée
// sur un canvas (redimensionnée au besoin), puis réencodée en WebP, PNG ou JPEG.
// Rien n'est envoyé sur un serveur. L'ancien outil chargeait la librairie
// browser-image-compression depuis un CDN pour le JPEG : le canvas suffit.

const root = document.querySelector<HTMLElement>("[data-compressor]");
const dropzone = root?.querySelector<HTMLElement>("[data-dropzone]");
const fileInput = root?.querySelector<HTMLInputElement>("[data-file-input]");
const results = root?.querySelector<HTMLElement>("[data-results]");
const list = root?.querySelector<HTMLElement>("[data-results-list]");
const template = root?.querySelector<HTMLTemplateElement>("[data-card-template]");

const FORMATS: Record<string, { mime: string; ext: string }> = {
  webp: { mime: "image/webp", ext: "webp" },
  png: { mime: "image/png", ext: "png" },
  jpeg: { mime: "image/jpeg", ext: "jpg" },
};

function options() {
  const value = (name: string) => root?.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)?.value ?? "";
  return {
    format: FORMATS[value("format")] ?? FORMATS.webp!,
    quality: Number(value("quality")) || 0.82,
    maxSide: Number(value("width")) || null,
  };
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

async function compress(file: File) {
  const { format, quality, maxSide } = options();
  const bitmap = await createImageBitmap(file);
  const scale = maxSide ? Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height)) : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponible");
  // Le JPEG n'a pas de transparence : fond blanc plutôt que noir.
  if (format.mime === "image/jpeg") {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const thumb = thumbnail(bitmap);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, format.mime, format.mime === "image/png" ? undefined : quality),
  );
  if (!blob) throw new Error("Encodage impossible");
  return { blob, thumb, name: `${file.name.replace(/\.[^.]+$/, "")}.${format.ext}` };
}

/** Vignette en data: URL. La CSP du `.htaccess` (img-src) n'autorise pas les images blob:. */
function thumbnail(bitmap: ImageBitmap) {
  const size = 112;
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

async function processFile(file: File) {
  if (!template || !list) return;
  const card = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
  const thumb = card.querySelector<HTMLImageElement>("[data-thumb]");
  const name = card.querySelector<HTMLElement>("[data-name]");
  const stats = card.querySelector<HTMLElement>("[data-stats]");
  const download = card.querySelector<HTMLAnchorElement>("[data-download]");
  if (name) name.textContent = file.name;
  list.append(card);

  try {
    const { blob, thumb: preview, name: outName } = await compress(file);
    if (thumb) thumb.src = preview;
    const gain = 100 * (1 - blob.size / file.size);
    if (stats) {
      stats.textContent = `${formatSize(file.size)} → ${formatSize(blob.size)} (${gain >= 0 ? "−" : "+"}${Math.abs(gain).toFixed(0)} %)`;
      stats.dataset.state = gain >= 0 ? "good" : "bad";
    }
    if (download) {
      download.href = URL.createObjectURL(blob);
      download.download = outName;
      download.hidden = false;
    }
  } catch {
    if (stats) {
      stats.textContent = "Ce fichier n'a pas pu être compressé.";
      stats.dataset.state = "bad";
    }
  }
}

function handleFiles(files: FileList | null) {
  const images = [...(files ?? [])].filter((file) => file.type.startsWith("image/"));
  if (images.length === 0 || !results) return;
  results.hidden = false;
  images.forEach((file) => void processFile(file));
}

dropzone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("is-over");
});
["dragleave", "drop"].forEach((type) => dropzone?.addEventListener(type, () => dropzone.classList.remove("is-over")));
dropzone?.addEventListener("drop", (event) => {
  event.preventDefault();
  handleFiles(event.dataTransfer?.files ?? null);
});
fileInput?.addEventListener("change", () => {
  handleFiles(fileInput.files);
  fileInput.value = "";
});

// Les téléchargements partent l'un après l'autre : certains navigateurs bloquent les envois simultanés.
root?.querySelector("[data-download-all]")?.addEventListener("click", () => {
  root.querySelectorAll<HTMLAnchorElement>("[data-download]:not([hidden])").forEach((link, index) => {
    setTimeout(() => link.click(), index * 200);
  });
});

// Fait du fichier un module : ses variables restent locales.
export {};
