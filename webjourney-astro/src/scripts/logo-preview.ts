// Aperçu au survol : une seule carte, qui suit le pointeur avec un léger retard.
// Le bandeau est découpé en zones, une par logo : chaque point appartient au logo
// le plus proche. Sans JavaScript ou au doigt, il reste un simple défilé de logos.
const OFFSET = 24; // écart entre le pointeur et la carte
const EDGE = 16; // marge gardée avec les bords de la fenêtre
const LAG = 110; // retard de la carte sur le pointeur, en millisecondes

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((marquee) => {
  const card = marquee.querySelector<HTMLElement>("[data-marquee-preview]");
  if (!card) return;

  const items = [...marquee.querySelectorAll<HTMLElement>("li")];
  // Une image par capture, créée au premier survol puis gardée.
  const shots = new Map<string, HTMLImageElement>();

  let pointer: { x: number; y: number } | null = null;
  let wanted: string | undefined; // capture de la zone survolée
  let shown = false;
  let frame = 0;
  let last = 0;
  const position = { x: 0, y: 0 }; // coin de la carte, dans la fenêtre

  const shotFor = (src: string) => {
    let shot = shots.get(src);
    if (!shot) {
      shot = new Image();
      shot.alt = "";
      shot.src = src;
      shots.set(src, shot);
    }
    return shot;
  };

  /** Logo dont la zone contient le point : le plus proche, écart mesuré bord à bord. */
  const zoneAt = (x: number, y: number) => {
    let nearest: HTMLElement | null = null;
    let smallest = Infinity;
    for (const item of items) {
      const box = item.getBoundingClientRect();
      if (!box.width) continue; // rangée masquée (animations réduites)
      const gap = Math.hypot(
        Math.max(box.left - x, x - box.right, 0),
        Math.max(box.top - y, y - box.bottom, 0),
      );
      if (gap < smallest) {
        nearest = item;
        smallest = gap;
      }
    }
    return nearest;
  };

  /** Place visée : centrée au-dessus du pointeur, sans sortir de la fenêtre. */
  const target = (at: { x: number; y: number }) => {
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    const maxX = document.documentElement.clientWidth - width - EDGE;
    // En dessous du pointeur quand la place manque sous la barre de navigation.
    const navBottom = document.querySelector("[data-nav]")?.getBoundingClientRect().bottom ?? 0;
    const above = at.y - OFFSET - height >= Math.max(navBottom, 0) + EDGE;
    return {
      x: Math.min(Math.max(at.x - width / 2, EDGE), maxX),
      y: above ? at.y - OFFSET - height : at.y + OFFSET,
    };
  };

  const show = async (src: string) => {
    const shot = shotFor(src);
    try {
      await shot.decode();
    } catch {
      return; // capture introuvable : pas d'aperçu
    }
    // Le pointeur a pu changer de zone pendant le chargement.
    if (wanted !== src || !pointer) return;
    if (!shown) {
      card.replaceChildren(shot);
      Object.assign(position, target(pointer));
      shown = true;
      card.classList.add("is-visible");
    } else if (card.lastElementChild !== shot) {
      // Changement de zone carte ouverte : la nouvelle capture se fond sur l'ancienne.
      while (card.children.length > 1) card.firstElementChild?.remove();
      card.append(shot);
    }
  };

  const hide = () => {
    wanted = undefined;
    shown = false;
    card.classList.remove("is-visible");
  };

  // Tourne tant que le pointeur est sur le bandeau : les logos défilent sous lui,
  // la zone survolée peut donc changer sans qu'il bouge.
  const tick = (now: number) => {
    if (!pointer) return;
    const box = marquee.getBoundingClientRect();
    // Page défilée sous un pointeur immobile : il n'est plus sur le bandeau.
    const over = pointer.y >= box.top && pointer.y <= box.bottom;
    const src = over ? zoneAt(pointer.x, pointer.y)?.dataset.preview : undefined;
    if (src !== wanted) {
      if (src) show((wanted = src));
      else hide();
    }

    if (shown) {
      const to = target(pointer);
      // Part du chemin parcourue depuis la dernière image, quel que soit l'écran.
      const step = reducedMotion ? 1 : 1 - Math.exp(-(now - last) / LAG);
      position.x += (to.x - position.x) * step;
      position.y += (to.y - position.y) * step;
      card.style.translate = `${position.x - box.left}px ${position.y - box.top}px`;
    }
    last = now;
    frame = requestAnimationFrame(tick);
  };

  marquee.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const starting = !pointer;
    pointer = { x: event.clientX, y: event.clientY };
    if (starting) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  });

  marquee.addEventListener("pointerleave", () => {
    pointer = null;
    cancelAnimationFrame(frame);
    hide();
  });
});
