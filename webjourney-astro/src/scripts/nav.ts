// Barre de navigation : comportement au scroll et menu déroulant mobile.

const nav = document.querySelector<HTMLElement>("[data-nav]");
const trigger = document.querySelector<HTMLElement>("[data-menu-trigger]");
const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
const topbar = document.querySelector<HTMLElement>("[data-topbar]");

if (nav && trigger && panel) {
  // Tant que le bandeau de contact est à l'écran, on est « en haut de page ».
  const topZone = () => (topbar?.offsetHeight ?? 0) + 10;
  const SCROLL_DELTA = 6; // ignore les micro-mouvements (inertie, trackpad)
  const desktop = window.matchMedia("(min-width: 62em)");

  const isOpen = () => trigger.getAttribute("aria-expanded") === "true";

  const setOpen = (open: boolean) => {
    trigger.setAttribute("aria-expanded", String(open));
    panel.toggleAttribute("data-open", open);
    // inert sort le menu fermé du parcours clavier et des lecteurs d'écran.
    panel.inert = !open;
    // Menu ouvert : la barre prend son fond, même en haut d'un hero.
    nav.classList.toggle("is-open", open);
  };

  // En haut de page : barre visible. Scroll vers le bas : elle sort de l'écran.
  // Scroll vers le haut : elle revient, et garde son fond jusqu'au retour tout en haut.
  let lastScrollY = window.scrollY;

  const updateOnScroll = () => {
    const y = window.scrollY;
    const atTop = y <= topZone();
    nav.classList.toggle("is-scrolled", !atTop);

    if (atTop || isOpen()) {
      nav.classList.remove("is-hidden");
      lastScrollY = y;
      return;
    }
    if (Math.abs(y - lastScrollY) < SCROLL_DELTA) return;
    nav.classList.toggle("is-hidden", y > lastScrollY);
    lastScrollY = y;
  };

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  updateOnScroll();

  trigger.addEventListener("click", () => setOpen(!isOpen()));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    trigger.focus();
  });

  document.addEventListener("click", (event) => {
    if (!isOpen() || !(event.target instanceof Node)) return;
    if (panel.contains(event.target) || trigger.contains(event.target)) return;
    setOpen(false);
  });

  // Passage en largeur desktop : le menu déroulant n'existe plus, on le referme.
  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
