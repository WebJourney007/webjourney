// Outil d'audit : envoie l'URL à `audit-api.php` (qui relaie un service Lighthouse
// hébergé chez Vercel), affiche le rapport mobile, charge le rapport desktop en
// arrière-plan, puis propose d'être recontacté (`send-audit-lead.php`).
// Porté de l'ancien `js/audit.js` ; mêmes requêtes, mêmes champs envoyés.

interface Scores {
  global: number | null;
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
}

interface Report {
  url?: string;
  scores: Scores;
  vitals?: Record<string, string | null>;
  issues?: { level: string; title: string; desc: string }[];
  positives?: { title: string; desc?: string }[];
  error?: string;
}

type Strategy = "mobile" | "desktop";

const root = document.querySelector<HTMLElement>("[data-audit]");
const $ = <T extends HTMLElement>(name: string) => root?.querySelector<T>(`[data-audit-${name}]`) ?? null;

const form = $<HTMLFormElement>("form");
const input = $<HTMLInputElement>("url");
const formError = $("form-error");
const loader = $("loader");
const loaderUrl = $("loader-url");
const failure = $("failure");
const report = $("report");
const leadForm = $<HTMLFormElement>("lead");
const leadStatus = $("lead-status");

let currentUrl = "";
let currentScores: Partial<Scores> = {};
const cache: Record<Strategy, Report | null> = { mobile: null, desktop: null };

function grade(score: number | null | undefined) {
  if (score == null) return { tone: "none", label: "Non disponible" };
  if (score >= 90) return { tone: "good", label: "Bon" };
  if (score >= 50) return { tone: "average", label: "À améliorer" };
  return { tone: "poor", label: "Faible" };
}

function normalizeUrl(raw: string): string | null {
  const value = /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`;
  try {
    return new URL(value).hostname.includes(".") ? value : null;
  } catch {
    return null;
  }
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ring(score: number | null) {
  const radius = 28;
  const length = 2 * Math.PI * radius;
  const offset = score == null ? length : length - (score / 100) * length;
  return `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle class="ring__bg" cx="32" cy="32" r="${radius}"/>
    <circle class="ring__fill" cx="32" cy="32" r="${radius}" stroke-dasharray="${length}" stroke-dashoffset="${offset}"/>
  </svg><span class="ring__value">${score ?? "—"}</span>`;
}

function renderScores(scores: Scores) {
  report?.querySelectorAll<HTMLElement>("[data-score]").forEach((card) => {
    const key = card.dataset.score as keyof Scores;
    const score = scores[key];
    const { tone, label } = grade(score);
    card.dataset.tone = tone;
    const ringEl = card.querySelector("[data-ring]");
    const statusEl = card.querySelector("[data-status]");
    if (ringEl) ringEl.innerHTML = ring(score);
    if (statusEl) statusEl.textContent = label;
  });
}

function renderList(name: string, html: string) {
  const list = $(name);
  if (list) list.innerHTML = html;
}

function render(data: Report) {
  currentScores = data.scores;
  renderScores(data.scores);

  Object.entries(data.vitals ?? {}).forEach(([key, value]) => {
    const cell = report?.querySelector(`[data-vital="${key}"]`);
    if (cell) cell.textContent = value ?? "—";
  });

  const issues = data.issues ?? [];
  renderList(
    "issues",
    issues.length === 0
      ? `<li class="issue issue--good">Aucun problème critique détecté.</li>`
      : issues
          .map((i) => `<li class="issue issue--${i.level === "critical" ? "poor" : "average"}"><strong>${escapeHtml(i.title)}</strong><span>${escapeHtml(i.desc)}</span></li>`)
          .join(""),
  );
  const positives = data.positives ?? [];
  renderList(
    "positives",
    positives.map((p) => `<li class="issue issue--good"><strong>${escapeHtml(p.title)}</strong>${p.desc ? `<span>${escapeHtml(p.desc)}</span>` : ""}</li>`).join(""),
  );
  const positivesBlock = $("positives-block");
  if (positivesBlock) positivesBlock.hidden = positives.length === 0;

  const urlEl = $("analyzed-url");
  if (urlEl) urlEl.textContent = data.url ?? currentUrl;
}

function setTab(strategy: Strategy) {
  root?.querySelectorAll<HTMLButtonElement>("[data-strategy]").forEach((tab) => {
    tab.setAttribute("aria-pressed", String(tab.dataset.strategy === strategy));
  });
  const data = cache[strategy];
  if (data) render(data);
}

async function fetchReport(url: string, strategy: Strategy): Promise<Report> {
  const response = await fetch(`/audit-api.php?url=${encodeURIComponent(url)}&strategy=${strategy}`);
  const data = (await response.json()) as Report;
  if (!response.ok || data.error) throw new Error(data.error ?? "Erreur inconnue");
  return data;
}

async function runAudit(url: string) {
  currentUrl = url;
  cache.mobile = null;
  cache.desktop = null;
  if (report) report.hidden = true;
  if (failure) failure.hidden = true;
  if (loaderUrl) loaderUrl.textContent = url;
  if (loader) loader.hidden = false;
  if (leadForm) leadForm.hidden = false;
  if (leadStatus) leadStatus.hidden = true;

  const desktopTab = root?.querySelector<HTMLButtonElement>('[data-strategy="desktop"]');
  if (desktopTab) desktopTab.disabled = true;
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) button.disabled = true;

  try {
    cache.mobile = await fetchReport(url, "mobile");
    if (loader) loader.hidden = true;
    if (report) report.hidden = false;
    setTab("mobile");
    report?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Le rapport desktop arrive en arrière-plan ; l'onglet s'active quand il est là.
    fetchReport(url, "desktop")
      .then((data) => (cache.desktop = data))
      .catch(() => {})
      .finally(() => {
        if (desktopTab) desktopTab.disabled = cache.desktop === null;
      });
  } catch {
    if (loader) loader.hidden = true;
    if (failure) failure.hidden = false;
  } finally {
    if (button) button.disabled = false;
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = normalizeUrl(input?.value ?? "");
  if (formError) formError.hidden = url !== null;
  if (url) void runAudit(url);
});

root?.querySelectorAll<HTMLButtonElement>("[data-strategy]").forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.strategy as Strategy));
});

root?.querySelectorAll<HTMLButtonElement>("[data-audit-restart]").forEach((button) => {
  button.addEventListener("click", () => {
    if (report) report.hidden = true;
    if (failure) failure.hidden = true;
    if (input) {
      input.value = "";
      input.focus();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = leadForm.querySelector<HTMLInputElement>('input[type="email"]')?.value.trim() ?? "";
  const button = leadForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!email || !leadStatus) return;

  const body = new FormData();
  body.append("email", email);
  body.append("url", currentUrl);
  body.append("score_perf", String(currentScores.performance ?? 0));
  body.append("score_seo", String(currentScores.seo ?? 0));
  body.append("score_a11y", String(currentScores.accessibility ?? 0));
  body.append("score_bp", String(currentScores.bestPractices ?? 0));

  if (button) button.disabled = true;
  try {
    const response = await fetch("/send-audit-lead.php", { method: "POST", body });
    const data = (await response.json()) as { success?: boolean; message?: string };
    leadStatus.textContent = data.success ? "Merci ! On vous recontacte très vite." : (data.message ?? "Erreur lors de l'envoi.");
    leadStatus.dataset.state = data.success ? "success" : "error";
    if (data.success) leadForm.hidden = true;
  } catch {
    leadStatus.textContent = "Erreur de connexion. Réessayez.";
    leadStatus.dataset.state = "error";
  } finally {
    leadStatus.hidden = false;
    if (button) button.disabled = false;
  }
});

// Fait du fichier un module : ses variables restent locales.
export {};
