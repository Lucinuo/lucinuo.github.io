const visual = document.querySelector("[data-ua-visual]");
const steps = [...document.querySelectorAll("[data-ua-stage]")];

if (visual && steps.length) {
  const observer = new IntersectionObserver((entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;
    steps.forEach((step) => step.classList.toggle("is-current", step === current.target));
    visual.dataset.stage = current.target.dataset.uaStage;
  }, { rootMargin: "-38% 0px -38%", threshold: 0 });

  steps.forEach((step) => observer.observe(step));
}
