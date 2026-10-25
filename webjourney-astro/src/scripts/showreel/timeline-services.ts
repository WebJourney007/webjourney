// Scènes 4 à 6 : les trois services. Temps en secondes depuis le début.
import { EASE, RISE, clip, count, fadeUp, hide, show, tween } from "./engine";

const POP = (from: string) => [
  { opacity: 0, transform: from },
  { opacity: 1, transform: "none" },
];

function sites() {
  // 4 — Sites internet (12,6 → 19,4 s)
  show(".s4", 12.6);
  tween(".s4", 12.6, 0.6, [{ opacity: 0 }, { opacity: 1 }], { ease: EASE.soft });
  hide(".s3", 13.3);
  tween(".s4-browser", 12.7, 1.2, POP("translateY(80px) scale(0.86)"));
  tween(".s4-browser video", 12.7, 6.6, [{ transform: "scale(1)" }, { transform: "scale(1.06)" }], { ease: EASE.linear });
  clip(".s4-browser video", 12.7, 19.2);
  tween(".s4 .kicker", 13.2, 0.8, fadeUp(20));
  tween(".s4-title .word", 13.3, 1.0, RISE, { stagger: 0.06 });
  tween(".s4-chips .chip", 14.5, 0.8, fadeUp(24), { stagger: 0.12 });
  tween(".s4-stat", 15.6, 1.0, POP("translateY(50px) scale(0.92)"));
  count(".s4-stat [data-count]", 15.8, 1.8, 240, { prefix: "+" });
}

function bookings() {
  // 5 — Réservations en ligne (18,5 → 25,5 s)
  show(".s5", 18.5);
  tween(".s5", 18.5, 0.8, [{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)" }], { ease: EASE.inOut });
  tween(".s4", 18.5, 0.8, [{ transform: "none" }, { transform: "translateX(-260px)" }], { ease: EASE.inOut });
  hide(".s4", 19.4);
  tween(".s5-browser", 18.7, 1.2, [{ transform: "translateX(120px) scale(0.94)" }, { transform: "none" }]);
  clip(".s5-browser video", 18.9, 25.0, 0.8);
  tween(".s5 .kicker", 19.3, 0.8, fadeUp(20));
  tween(".s5-title .word", 19.4, 1.0, RISE, { stagger: 0.05 });
  tween(".s5-chips .chip", 20.6, 0.8, fadeUp(24), { stagger: 0.12 });
  tween(".s5-notif", 21.0, 0.9, POP("translateX(80px) scale(0.94)"));
  tween(".s5-confirm", 22.2, 0.9, POP("translateX(80px) scale(0.94)"));
}

function identity() {
  // 6a — Couverture de la charte Varela Brothers (24,5 → 28,5 s)
  show(".s6a", 24.5);
  tween(".s6a", 24.5, 0.9, [{ clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)" }], { ease: EASE.inOut });
  hide(".s5", 25.5);
  tween(".s6a-img", 24.5, 3.6, [{ transform: "scale(1.2)" }, { transform: "scale(1)" }], { ease: EASE.soft });
  tween(".s6a .kicker", 25.3, 0.8, fadeUp(20));
  tween(".s6a-title .word", 25.4, 1.0, RISE, { stagger: 0.08 });
  tween(".s6a-meta", 25.8, 0.8, fadeUp(20));

  // 6b — La charte en bento (27,6 → 32,4 s)
  show(".s6b", 27.6);
  tween(".s6b", 27.6, 0.8, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], { ease: EASE.inOut });
  hide(".s6a", 28.5);
  tween(".vb-tile", 27.8, 1.0, fadeUp(90), { stagger: 0.1 });
  tween(".vb-img", 27.8, 2.2, [{ transform: "scale(1.25)" }, { transform: "scale(1)" }], { stagger: 0.1 });
  tween(".vb-swatch", 28.4, 0.8, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { ease: EASE.inOut, stagger: 0.08 });
  tween(".vb-gravure", 28.6, 0.9, fadeUp(30), { stagger: 0.12 });
  tween(".s6b-grid", 31.5, 0.8, [{ transform: "none" }, { transform: "scale(0.94)" }], { ease: EASE.inOut });

  // 6c — Du papier jusqu'au site (31,5 → 35,8 s)
  show(".s6c", 31.5);
  tween(".s6c", 31.5, 0.8, [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], { ease: EASE.inOut });
  hide(".s6b", 32.4);
  tween(".s6c-browser", 31.7, 1.2, POP("translateY(120px)"));
  clip(".s6c-browser video", 31.7, 36.0);
  tween(".s6c .kicker", 32.0, 0.8, fadeUp(20));
  tween(".s6c-title .word", 32.1, 1.0, RISE, { stagger: 0.06 });
  tween(".s6c-sub", 33.0, 0.8, fadeUp(20));
}

export function services() {
  sites();
  bookings();
  identity();
}
