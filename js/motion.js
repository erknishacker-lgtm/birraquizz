/**
 * Animações visíveis (Web Animations API + rAF).
 * Respeita prefers-reduced-motion.
 */
window.QuizMotion = (() => {
  const reduced = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wait(ms) {
    return new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
  }

  function resetInline(el) {
    if (!el) return;
    el.getAnimations?.().forEach((a) => a.cancel());
    el.style.opacity = "";
    el.style.transform = "";
    el.style.filter = "";
  }

  async function leave(el) {
    if (!el) return;
    if (reduced() || !el.animate) {
      el.style.opacity = "0";
      await wait(100);
      return;
    }
    const a = el.animate(
      [
        { opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0px)" },
        { opacity: 0, transform: "translateX(-48px) scale(0.92)", filter: "blur(5px)" },
      ],
      { duration: 340, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
    );
    await a.finished.catch(() => {});
  }

  async function enter(el, mode = "slide") {
    if (!el) return;
    resetInline(el);
    if (reduced() || !el.animate) {
      el.style.opacity = "1";
      return;
    }

    const keyframes =
      mode === "slam"
        ? [
            {
              opacity: 0,
              transform: "scale(1.22) rotate(-2deg) translateY(40px)",
              filter: "blur(8px)",
            },
            {
              opacity: 1,
              transform: "scale(1) rotate(0deg) translateY(0)",
              filter: "blur(0px)",
            },
          ]
        : mode === "up"
          ? [
              { opacity: 0, transform: "translateY(56px) scale(0.94)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ]
          : [
              { opacity: 0, transform: "translateX(56px) scale(0.94)" },
              { opacity: 1, transform: "translateX(0) scale(1)" },
            ];

    const a = el.animate(keyframes, {
      duration: mode === "slam" ? 620 : 440,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    });
    await a.finished.catch(() => {});
    resetInline(el);
  }

  function stagger(root, selector = "[data-reveal]", gap = 90) {
    if (!root) return;
    const nodes = [...root.querySelectorAll(selector)];
    nodes.forEach((node, i) => {
      if (reduced() || !node.animate) {
        node.style.opacity = "1";
        return;
      }
      node.style.opacity = "0";
      node.animate(
        [
          { opacity: 0, transform: "translateY(22px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 420,
          delay: 80 + i * gap,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }
      );
    });
  }

  function ripple(btn, event) {
    if (!btn || reduced()) return;
    const rect = btn.getBoundingClientRect();
    const x = (event?.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (event?.clientY ?? rect.top + rect.height / 2) - rect.top;
    const wave = document.createElement("span");
    wave.className = "js-ripple";
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    btn.classList.add("has-ripple");
    btn.appendChild(wave);
    window.setTimeout(() => wave.remove(), 650);
  }

  /** Contador de 0 → target (bem visível) */
  function countUp(el, target, opts = {}) {
    if (!el) return;
    const duration = opts.duration ?? 1100;
    const suffix = opts.suffix ?? "";
    const prefix = opts.prefix ?? "";
    const decimals = opts.decimals ?? 0;
    if (reduced()) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (target - from) * eased;
      el.textContent = `${prefix}${val.toFixed(decimals)}${suffix}`;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = `${prefix}${Number(target).toFixed(decimals)}${suffix}`;
    }
    requestAnimationFrame(frame);
  }

  /** Digita o texto letra a letra no headline */
  async function typewriter(el, text, speed = 18) {
    if (!el) return;
    if (reduced()) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    el.classList.add("is-typing");
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await wait(speed);
    }
    el.classList.remove("is-typing");
  }

  /** Carimbo URGENTE / HOY que "bate" na tela */
  function stamp(root, label) {
    if (!root) return;
    const s = document.createElement("div");
    s.className = "js-stamp";
    s.textContent = label;
    s.setAttribute("aria-hidden", "true");
    root.appendChild(s);
    if (!reduced() && s.animate) {
      s.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(2.4) rotate(-18deg)" },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(-12deg)" },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1.05) rotate(-12deg)" },
          { opacity: 0.92, transform: "translate(-50%, -50%) scale(1) rotate(-12deg)" },
        ],
        { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
      );
    }
    window.setTimeout(() => {
      if (!reduced() && s.animate) {
        s.animate([{ opacity: 0.92 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished
          .then(() => s.remove())
          .catch(() => s.remove());
      } else s.remove();
    }, 1600);
  }

  /** Barra vermelha de "impacto" no topo ao abrir notícia */
  function impactBar(root) {
    if (!root || reduced()) return;
    const bar = document.createElement("div");
    bar.className = "js-impact-bar";
    root.appendChild(bar);
    bar.animate(
      [
        { transform: "scaleX(0)", opacity: 1 },
        { transform: "scaleX(1)", opacity: 1 },
        { transform: "scaleX(1)", opacity: 0 },
      ],
      { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
    ).finished.then(() => bar.remove()).catch(() => bar.remove());
  }

  function runMeters(root) {
    if (!root) return;
    root.querySelectorAll("[data-meter]").forEach((m, i) => {
      const target = Number(m.dataset.meter) || 80;
      window.setTimeout(() => {
        m.style.width = `${target}%`;
      }, reduced() ? 0 : 250 + i * 220);
    });
  }

  function pulseCta(btn) {
    if (!btn || reduced() || !btn.animate) return;
    btn.animate(
      [
        { transform: "scale(1)", boxShadow: "0 8px 18px rgba(200,120,20,0.35)" },
        { transform: "scale(1.04)", boxShadow: "0 12px 32px rgba(200,120,20,0.55)" },
        { transform: "scale(1)", boxShadow: "0 8px 18px rgba(200,120,20,0.35)" },
      ],
      { duration: 1400, iterations: Infinity, easing: "ease-in-out" }
    );
  }

  /** Feedback forte ao escolher opção */
  function pickPop(btn) {
    if (!btn || reduced() || !btn.animate) return;
    btn.animate(
      [
        { transform: "scale(1)", backgroundColor: "#fff" },
        { transform: "scale(1.03)", backgroundColor: "#fff8e0" },
        { transform: "scale(0.98)", backgroundColor: "#fff3c4" },
        { transform: "scale(1)", backgroundColor: "#fffbeb" },
      ],
      { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }

  /** Shake da tela toda (notícia forte) */
  function screenShake(el) {
    if (!el || reduced() || !el.animate) return;
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 420, easing: "ease-in-out" }
    );
  }

  /** Flash branco/vermelho de "página de jornal" */
  function pageFlash(root) {
    if (!root || reduced()) return;
    const f = document.createElement("div");
    f.className = "js-page-flash";
    root.appendChild(f);
    f.animate(
      [
        { opacity: 0.85, background: "rgba(180,30,30,0.35)" },
        { opacity: 0, background: "rgba(255,255,255,0)" },
      ],
      { duration: 500, easing: "ease-out", fill: "forwards" }
    ).finished.then(() => f.remove()).catch(() => f.remove());
  }

  return {
    reduced,
    wait,
    leave,
    enter,
    stagger,
    ripple,
    countUp,
    typewriter,
    stamp,
    impactBar,
    runMeters,
    pulseCta,
    pickPop,
    screenShake,
    pageFlash,
  };
})();
