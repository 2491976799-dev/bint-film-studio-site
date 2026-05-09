const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const worksRail = document.querySelector("[data-works-rail]");
const prevButton = document.querySelector("[data-rail-prev]");
const nextButton = document.querySelector("[data-rail-next]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const scrollWorks = (direction) => {
  if (!worksRail) return;
  worksRail.scrollBy({
    left: direction * Math.max(worksRail.clientWidth * 0.82, 320),
    behavior: "smooth",
  });
};

prevButton?.addEventListener("click", () => scrollWorks(-1));
nextButton?.addEventListener("click", () => scrollWorks(1));
