// Scènes 1 à 3. Temps en secondes depuis le début du showreel.
import { DRAW, EASE, RISE, fadeUp, hide, show, tween } from "./engine";

export function opening() {
  // 1 — Mot-symbole (0 → 3,6 s)
  tween(".s1-mark .word", 0.3, 1.1, RISE, { stagger: 0.1 });
  tween(".s1-line", 0.7, 1.1, DRAW, { ease: EASE.inOut });
  tween(".s1-tag", 1.2, 0.9, fadeUp(16));
  tween(".s1-center", 2.45, 0.6, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-70px)" }], { ease: EASE.in });

  // 2 — Accroche (2,75 → 7,5 s)
  show(".s2", 2.75);
  tween(".s2", 2.75, 0.8, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], { ease: EASE.inOut });
  hide(".s1", 3.6);
  tween(".s2-title .word", 3.1, 1.0, RISE, { stagger: 0.07 });
  tween(".s2-services li", 4.5, 0.8, fadeUp(24), { stagger: 0.12 });
  tween(".s2", 6.6, 0.8, [{ transform: "none" }, { transform: "translateY(-35%)" }], { ease: EASE.inOut });

  // 3 — Mur de sites (6,6 → 13,3 s)
  show(".s3", 6.6);
  tween(".s3", 6.6, 0.8, [{ transform: "translateY(100%)" }, { transform: "none" }], { ease: EASE.inOut });
  hide(".s2", 7.5);
  tween(".s3-zoom", 6.6, 3, [{ transform: "scale(1.35)" }, { transform: "scale(1)" }]);
  const drift = 700;
  tween(".s3-col:nth-child(odd)", 6.6, 6.8, [{ transform: "translateY(0)" }, { transform: `translateY(-${drift}px)` }], { ease: EASE.soft });
  tween(".s3-col:nth-child(even)", 6.6, 6.8, [{ transform: `translateY(-${drift}px)` }, { transform: "translateY(0)" }], { ease: EASE.soft });
  tween(".s3-veil", 7.6, 1.0, [{ opacity: 0 }, { opacity: 1 }], { ease: EASE.soft });
  tween(".s3-title .word", 8.0, 1.0, RISE, { stagger: 0.08 });
  tween(".s3-title .word", 12.1, 0.6, [{ transform: "none" }, { transform: "translateY(-110%)" }], { ease: EASE.in, stagger: 0.04 });
  tween(".s3-zoom", 12.3, 1.0, [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.6)" }], { ease: EASE.in });
}
