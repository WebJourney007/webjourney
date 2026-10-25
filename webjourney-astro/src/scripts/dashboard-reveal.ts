// Lance les animations d'un tableau de bord quand il entre à l'écran, une seule fois.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add("is-visible");
      observer.unobserve(target);
    });
  },
  { threshold: 0.35 },
);

document.querySelectorAll<HTMLElement>("[data-dash]").forEach((block) => observer.observe(block));
