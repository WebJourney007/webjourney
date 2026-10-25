// Scènes 7 à 9 : preuves, clients, fin. Temps en secondes depuis le début.
import { DRAW, EASE, RISE, clip, count, fadeUp, hide, show, tween } from "./engine";

export const DURATION = 49.5;

export function closing() {
  // 7 — Bento des preuves (34,9 → 41 s)
  show(".s7", 34.9);
  tween(".s7", 34.9, 0.8, [{ transform: "translateY(100%)" }, { transform: "none" }], { ease: EASE.inOut });
  tween(".s6c", 34.9, 0.8, [{ transform: "none" }, { transform: "translateY(-30%)" }], { ease: EASE.inOut });
  hide(".s6c", 35.8);
  tween(".s7 .tile", 35.2, 1.0, [{ opacity: 0, transform: "translateY(60px) scale(0.94)" }, { opacity: 1, transform: "none" }], { stagger: 0.08 });
  count(".s7-sites [data-count]", 35.4, 2.0, 30);
  clip(".s7-video video", 35.2, 40.9);

  // 8 — Clients (40,1 → 44,6 s)
  show(".s8", 40.1);
  tween(".s8", 40.1, 0.8, [{ transform: "translateX(100%)" }, { transform: "none" }], { ease: EASE.inOut });
  tween(".s7", 40.1, 0.8, [{ transform: "none" }, { transform: "translateX(-30%)" }], { ease: EASE.inOut });
  hide(".s7", 41.0);
  tween(".s8-title .word", 40.6, 1.0, RISE, { stagger: 0.07 });
  tween(".s8-logo img", 41.0, 0.8, fadeUp(30), { stagger: 0.05 });
  tween(".s8-inner", 43.7, 0.6, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-50px)" }], { ease: EASE.in });

  // 9 — Fin (44,1 → 49,5 s)
  show(".s9", 44.1);
  tween(".s9", 44.1, 0.4, [{ opacity: 0 }, { opacity: 1 }], { ease: EASE.soft });
  hide(".s8", 44.6);
  tween(".s9-inner", 44.1, DURATION - 44.1, [{ transform: "scale(1)" }, { transform: "scale(1.04)" }], { ease: EASE.linear });
  tween(".s9-title .word", 44.4, 1.1, RISE, { stagger: 0.09 });
  tween(".s9-line", 45.8, 1.0, DRAW, { ease: EASE.inOut });
  tween(".s9-mark .word", 46.1, 1.0, RISE, { stagger: 0.08 });
  tween(".s9-meta", 46.5, 0.8, fadeUp(16));
  tween(".s9-cta", 46.8, 0.9, [{ opacity: 0, transform: "scale(0.85)" }, { opacity: 1, transform: "none" }]);
}
