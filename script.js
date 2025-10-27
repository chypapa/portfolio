document.body.addEventListener("pointermove", (e) => {
  const { currentTarget: el, clientX: x, clientY: y } = e;
  const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
  el.style.setProperty("--posX", x - l - w / 2);
  el.style.setProperty("--posY", y - t - h / 2);
});

document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("is-loaded");
  });

  const pages = [...document.querySelectorAll(".page")];
  const digits = [...document.querySelectorAll(".digit")];
  const homeBtn = document.getElementById("homeBtn");
  const seeWorks = document.getElementById("seeWorks");
  const nextBtn = document.getElementById("nextBtn");

  const DURATION = 420;
  const EASING = "cubic-bezier(0.25, 0.8, 0.25, 1)";

  function measureWidthForState(btn, wantExpanded) {
    const clone = btn.cloneNode(true);
    clone.style.visibility = "hidden";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = "auto";
    clone.style.transition = "none";
    if (wantExpanded) clone.classList.add("expanded");
    document.body.appendChild(clone);
    const w = Math.ceil(clone.getBoundingClientRect().width);
    document.body.removeChild(clone);
    return w;
  }

  function cleanupTransitionListener(btn) {
    if (btn._teardownTransition) {
      btn.removeEventListener("transitionend", btn._teardownTransition);
      btn._teardownTransition = null;
    }
  }

  function animateWidthTo(btn, targetPx) {
    cleanupTransitionListener(btn);
    return new Promise((resolve) => {
      const prevTransition = btn.style.transition || "";
      btn.style.transition = `width ${DURATION}ms ${EASING}, ${prevTransition}`;
      const start = btn.getBoundingClientRect().width;
      btn.style.width = `${start}px`;
      btn.getBoundingClientRect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          btn.style.width = `${Math.ceil(targetPx)}px`;
        });
      });
      const onEnd = (e) => {
        if (e.propertyName !== "width") return;
        cleanupTransitionListener(btn);
        if (!btn.classList.contains("expanded")) {
          btn.style.width = "";
        }
        btn.style.transition = prevTransition;
        resolve();
      };
      btn._teardownTransition = onEnd;
      btn.addEventListener("transitionend", onEnd);
    });
  }

  async function expand(btn) {
    if (btn.classList.contains("expanded")) return;
    const startW = btn.getBoundingClientRect().width;
    btn.style.width = `${Math.ceil(startW)}px`;
    btn.classList.add("expanded");
    const targetW = measureWidthForState(btn, true);
    await animateWidthTo(btn, targetW);
  }

  async function collapse(btn) {
    if (!btn.classList.contains("expanded")) return;
    btn.classList.remove("expanded");
    btn.style.width = "";
  }

  // Управление страницами
  let current = 0;
  function showPage(n) {
    if (n < 0 || n >= pages.length) return;
    current = n;
    pages.forEach((pg, i) => pg.classList.toggle("active", i === n));
    homeBtn.classList.toggle("inactive", n !== 0);

    digits.forEach((btn) => {
      const p = +btn.dataset.page;
      if (p === n) {
        btn.classList.add("active");
        expand(btn);
      } else {
        btn.classList.remove("active");
        collapse(btn);
      }
    });

    // На маленьких экранах включаем видимость соцкнопок только на главной
    if (window.innerWidth <= 500) {
      const header = document.querySelector("header");
      if (n === 0) header.classList.add("show-social-from-js");
      else header.classList.remove("show-social-from-js");
    }
  }

  // Обработчики событий
  homeBtn.addEventListener("click", () => showPage(0));
  digits.forEach((btn) => {
    btn.addEventListener("click", () => showPage(+btn.dataset.page));
  });
  seeWorks?.addEventListener("click", () => showPage(1));
  nextBtn?.addEventListener("click", () => {
    const next = (current + 1) % pages.length;
    showPage(next);
  });

  // Запуск на домашней странице
  showPage(0);
});
document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('video').forEach(v => {
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = v.preload || 'auto'; v.controls = false;// отключаем панель управления
        v.removeAttribute('controls');// на всякий случай удаляем атрибут из DOM
        v.setAttribute('autoplay', ''); v.play().catch(() => { });
      });
    });