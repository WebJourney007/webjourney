// Barre de navigation : comportement au scroll, menu déroulant mobile et
// panneau « Services » sur desktop.

const nav = document.querySelector<HTMLElement>("[data-nav]");
const trigger = document.querySelector<HTMLElement>("[data-menu-trigger]");
const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
const topbar = document.querySelector<HTMLElement>("[data-topbar]");
const services = document.querySelector<HTMLElement>("[data-services]");
const servicesTrigger = document.querySelector<HTMLElement>("[data-services-trigger]");
const servicesPanel = document.querySelector<HTMLElement>("[data-services-panel]");

if (nav && trigger && panel && services && servicesTrigger && servicesPanel) {
  // Tant que le bandeau de contact est à l'écran, on est « en haut de page ».
  const topZone = () => (topbar?.offsetHeight ?? 0) + 10;
  const SCROLL_DELTA = 6; // ignore les micro-mouvements (inertie, trackpad)
  const CLOSE_DELAY = 150; // laisse le curseur passer du bouton au panneau
  const desktop = window.matchMedia("(min-width: 62em)");

  const isOpen = () => trigger.getAttribute("aria-expanded") === "true";
  const servicesOpen = () => servicesTrigger.getAttribute("aria-expanded") === "true";

  // Menu ou panneau ouvert : la barre prend son fond, même en haut d'un hero,
  // et ne sort pas de l'écran au scroll.
  const anyOpen = () => isOpen() || servicesOpen();
  const syncNav = () => nav.classList.toggle("is-open", anyOpen());

  const setOpen = (open: boolean) => {
    trigger.setAttribute("aria-expanded", String(open));
    panel.toggleAttribute("data-open", open);
    // inert sort le menu fermé du parcours clavier et des lecteurs d'écran.
    panel.inert = !open;
    syncNav();
  };

  let closeTimer: number | undefined;

  // Bornes de l'interruption de la ligne du bas de la barre sous le panneau.
  const markServicesGap = () => {
    const bar = nav.getBoundingClientRect();
    const box = servicesPanel.getBoundingClientRect();
    nav.style.setProperty("--gap-start", `${box.left - bar.left}px`);
    nav.style.setProperty("--gap-end", `${box.right - bar.left}px`);
  };

  const setServices = (open: boolean) => {
    window.clearTimeout(closeTimer);
    if (open) markServicesGap();
    servicesTrigger.setAttribute("aria-expanded", String(open));
    servicesPanel.toggleAttribute("data-open", open);
    servicesPanel.inert = !open;
    syncNav();
  };

  // En haut de page : barre visible. Scroll vers le bas : elle sort de l'écran.
  // Scroll vers le haut : elle revient, et garde son fond jusqu'au retour tout en haut.
  let lastScrollY = window.scrollY;

  const updateOnScroll = () => {
    const y = window.scrollY;
    const atTop = y <= topZone();
    nav.classList.toggle("is-scrolled", !atTop);

    if (atTop || anyOpen()) {
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

  // Panneau « Services » : la souris l'ouvre au survol ; le tap et le clavier
  // passent par le clic. Un clic de souris sur le bouton, déjà ouvert par le
  // survol, le laisse ouvert au lieu de le refermer aussitôt.
  let lastPointer = "";

  services.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    setServices(true);
  });

  services.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    closeTimer = window.setTimeout(() => setServices(false), CLOSE_DELAY);
  });

  servicesTrigger.addEventListener("pointerdown", (event) => {
    lastPointer = event.pointerType;
  });

  servicesTrigger.addEventListener("click", () => {
    setServices(lastPointer === "mouse" ? true : !servicesOpen());
    lastPointer = "";
  });

  // Le focus clavier qui part vers un autre élément referme le panneau. Sans
  // destination (clic dans une zone vide du panneau), on ne fait rien : le clic
  // en dehors est traité plus bas.
  services.addEventListener("focusout", (event) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || services.contains(next)) return;
    setServices(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (isOpen()) {
      setOpen(false);
      trigger.focus();
    }
    if (servicesOpen()) {
      setServices(false);
      servicesTrigger.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (isOpen() && !panel.contains(event.target) && !trigger.contains(event.target)) setOpen(false);
    if (servicesOpen() && !services.contains(event.target)) setServices(false);
  });

  // Passage en largeur desktop : le menu déroulant n'existe plus, on le referme.
  // Retour en mobile : c'est le panneau « Services » qui disparaît.
  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
    else setServices(false);
  });
}
