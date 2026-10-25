// Moteur du showreel : une seule horloge pilote les animations (Web Animations
// API, toujours en pause) et les vidéos. Même rendu en lecture directe et en
// export image par image : seule la source du temps change.

export const EASE = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  in: "cubic-bezier(0.7, 0, 0.84, 0)",
  soft: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  linear: "linear",
};

type Target = string | Element;
type Frames = Keyframe[];

interface TweenSpec {
  el: Element;
  start: number;
  dur: number;
  frames: Frames;
  ease: string;
}

interface Counter {
  el: Element;
  start: number;
  dur: number;
  to: number;
  prefix: string;
  suffix: string;
}

interface Clip {
  video: HTMLVideoElement;
  start: number;
  end: number;
  from: number;
}

const stage = document.querySelector<HTMLElement>("[data-stage]")!;
const specs: TweenSpec[] = [];
const animations: Animation[] = [];
const counters: Counter[] = [];
const clips: Clip[] = [];

function resolve(target: Target): Element[] {
  if (typeof target !== "string") return [target];
  const found = [...stage.querySelectorAll(target)];
  if (found.length === 0) throw new Error(`Showreel : aucun élément pour « ${target} »`);
  return found;
}

/** Anime `target` de `start` à `start + dur` secondes. `stagger` décale chaque élément trouvé. */
export function tween(target: Target, start: number, dur: number, frames: Frames, options: { ease?: string; stagger?: number } = {}) {
  const { ease = EASE.out, stagger = 0 } = options;
  resolve(target).forEach((el, i) => specs.push({ el, start: start + i * stagger, dur, frames, ease }));
}

/** Rend la scène visible à `at` (coupe franche). */
export function show(target: Target, at: number) {
  tween(target, at, 0.001, [{ visibility: "hidden" }, { visibility: "visible" }], { ease: EASE.linear });
}

/** Masque la scène à `at` : une scène recouverte ne coûte plus rien à l'affichage. */
export function hide(target: Target, at: number) {
  tween(target, at, 0.001, [{ visibility: "visible" }, { visibility: "hidden" }], { ease: EASE.linear });
}

/** Compteur qui monte de 0 à `to`. */
export function count(target: Target, start: number, dur: number, to: number, { prefix = "", suffix = "" } = {}) {
  resolve(target).forEach((el) => counters.push({ el, start, dur, to, prefix, suffix }));
}

/** Joue la vidéo de `target` entre `start` et `end`, depuis `from` secondes dans le fichier. */
export function clip(target: Target, start: number, end: number, from = 0) {
  resolve(target).forEach((el) => clips.push({ video: el as HTMLVideoElement, start, end, from }));
}

// Les animations sont créées dans l'ordre chronologique : sur un même élément, la
// plus tardive l'emporte. Seule la première remplit aussi avant son début ;
// les suivantes ne prennent la main qu'à leur départ.
function build() {
  const seen = new Set<Element>();
  specs
    .map((spec, order) => ({ spec, order }))
    .sort((a, b) => a.spec.start - b.spec.start || a.order - b.order)
    .forEach(({ spec }) => {
      const fill = seen.has(spec.el) ? "forwards" : "both";
      seen.add(spec.el);
      const anim = spec.el.animate(spec.frames, { duration: spec.dur * 1000, delay: spec.start * 1000, fill, easing: spec.ease });
      anim.pause();
      animations.push(anim);
    });
}

// Mouvements récurrents.
export const RISE: Frames = [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }];
export const DRAW: Frames = [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }];
export const fadeUp = (px: number): Frames => [
  { opacity: 0, transform: `translateY(${px}px)` },
  { opacity: 1, transform: "none" },
];

const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p));

/** Applique l'instant `t`. En lecture, les vidéos jouent ; à l'arrêt, elles sont calées sur l'image exacte. */
function render(t: number, playing: boolean): Promise<unknown>[] {
  animations.forEach((anim) => (anim.currentTime = t * 1000));

  counters.forEach(({ el, start, dur, to, prefix, suffix }) => {
    const p = Math.min(Math.max((t - start) / dur, 0), 1);
    const text = `${prefix}${Math.round(to * easeOutExpo(p))}${suffix}`;
    if (el.textContent !== text) el.textContent = text;
  });

  const seeks: Promise<unknown>[] = [];
  clips.forEach(({ video, start, end, from }) => {
    const target = from + Math.min(Math.max(t - start, 0), end - start);
    const active = t >= start && t < end;
    if (playing && active) {
      if (video.paused) {
        video.currentTime = target;
        video.play().catch(() => {});
      } else if (Math.abs(video.currentTime - target) > 0.25) {
        video.currentTime = target;
      }
      return;
    }
    if (!video.paused) video.pause();
    if (Math.abs(video.currentTime - target) > 0.001) {
      seeks.push(new Promise((done) => video.addEventListener("seeked", done, { once: true })));
      video.currentTime = target;
    }
  });
  return seeks;
}

const nextFrame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

function whenLoaded(): Promise<unknown> {
  const images = [...stage.querySelectorAll("img")].map((img) => img.decode().catch(() => {}));
  const videos = [...stage.querySelectorAll("video")].map((video) =>
    video.readyState >= 4
      ? null
      : new Promise((done) => {
          video.addEventListener("canplaythrough", done, { once: true });
          video.addEventListener("error", done, { once: true });
        }),
  );
  const timeout = new Promise((done) => setTimeout(done, 20000));
  return Promise.race([Promise.all([document.fonts.ready, ...images, ...videos]), timeout]);
}

/** Lecteur : lecture, pause et accès direct à un instant. */
function createPlayer(duration: number, startAt: number, loop: boolean) {
  const hud = document.querySelector<HTMLElement>("[data-hud]")!;
  let time = startAt;
  let playing = false;
  let origin = 0;

  const showTime = () => {
    hud.textContent = `${time.toFixed(1)} / ${duration.toFixed(1)} s · Espace : lecture · R : début · ← → : 1 s · F : plein écran`;
  };

  const tick = (now: number) => {
    if (!playing) return;
    time = (now - origin) / 1000;
    if (time >= duration) {
      if (loop) {
        origin = now;
        time = 0;
      } else {
        time = duration;
        pause();
        return;
      }
    }
    render(time, true);
    requestAnimationFrame(tick);
  };

  function play() {
    if (time >= duration) time = 0;
    origin = performance.now() - time * 1000;
    playing = true;
    document.body.classList.add("is-playing");
    requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    document.body.classList.remove("is-playing");
    render(time, false);
    showTime();
  }

  async function seek(t: number) {
    if (playing) pause();
    time = Math.min(Math.max(t, 0), duration);
    await Promise.all(render(time, false));
    showTime();
    await nextFrame();
  }

  hud.textContent = "Chargement des médias…";
  return { seek, toggle: () => (playing ? pause() : play()), now: () => time };
}

type Player = ReturnType<typeof createPlayer>;

function bindKeys(player: Player) {
  addEventListener("keydown", (event) => {
    if (event.code === "Space") player.toggle();
    else if (event.code === "KeyR") player.seek(0);
    else if (event.code === "ArrowRight") player.seek(player.now() + 1);
    else if (event.code === "ArrowLeft") player.seek(player.now() - 1);
    else if (event.code === "KeyF") document.documentElement.requestFullscreen().catch(() => {});
    else return;
    event.preventDefault();
  });
}

/** Construit la timeline et lance le lecteur. `?t=12` ouvre à 12 s, `?loop` boucle, `?export` masque les commandes. */
export function start(duration: number) {
  build();
  const params = new URLSearchParams(location.search);
  if (params.has("export")) document.body.classList.add("is-export");

  const fit = () => stage.style.setProperty("--k", String(Math.min(innerWidth / 1920, innerHeight / 1080)));
  fit();
  addEventListener("resize", fit);

  const startAt = Math.min(Number(params.get("t")) || 0, duration);
  const player = createPlayer(duration, startAt, params.has("loop"));
  bindKeys(player);
  const ready = whenLoaded().then(() => player.seek(startAt));
  // Point d'entrée du script d'export (scripts/export-showreel.mjs).
  Object.assign(window, { __showreel: { duration, ready, seek: player.seek } });
}
