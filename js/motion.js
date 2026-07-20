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

  /**
   * Contador de urgência (resultado final) — pulso, anel, brilho, contagem.
   * @param {HTMLElement} root .result-level
   * @param {number} target 0–100
   * @param {{ duration?: number }} [opts]
   */
  function urgencyMeter(root, target, opts = {}) {
    if (!root) return () => {};
    const level = Math.max(0, Math.min(100, Number(target) || 0));
    const duration = opts.duration ?? 1600;
    const fg = root.querySelector(".result-level-fg") || root.querySelector("#result-level-fg");
    const pctEl = root.querySelector("#result-level-pct") || root.querySelector(".result-level-core span");
    const core = root.querySelector(".result-level-core");
    const label = root.querySelector(".result-level-label");
    const ringWrap = root.querySelector(".result-level-ring");
    const r = 42;
    const circ = 2 * Math.PI * r;

    // cancel previous run
    if (root._urgencyStop) {
      try {
        root._urgencyStop();
      } catch (_) {}
    }

    // ensure pulse layers
    let aura = root.querySelector(".urgency-aura");
    if (!aura) {
      aura = document.createElement("div");
      aura.className = "urgency-aura";
      aura.setAttribute("aria-hidden", "true");
      root.insertBefore(aura, root.firstChild);
    }
    let ripples = root.querySelector(".urgency-ripples");
    if (!ripples) {
      ripples = document.createElement("div");
      ripples.className = "urgency-ripples";
      ripples.setAttribute("aria-hidden", "true");
      ripples.innerHTML = '<i class="urgency-ripple"></i><i class="urgency-ripple"></i><i class="urgency-ripple"></i>';
      root.insertBefore(ripples, root.firstChild);
    }

    root.classList.add("is-urgency-live");
    root.setAttribute("aria-live", "polite");

    if (fg) {
      fg.style.strokeDasharray = String(circ);
      fg.style.strokeDashoffset = String(circ);
      fg.style.transition = "none";
    }
    if (pctEl) pctEl.textContent = "0";

    if (reduced()) {
      if (fg) fg.style.strokeDashoffset = String(circ * (1 - level / 100));
      if (pctEl) pctEl.textContent = String(Math.round(level));
      root.classList.add("is-urgency-static");
      return () => {
        root.classList.remove("is-urgency-live", "is-urgency-static");
      };
    }

    let raf = 0;
    let liveRaf = 0;
    let stopped = false;
    const start = performance.now();
    const anims = [];

    // Entrance: scale-in slam
    if (root.animate) {
      anims.push(
        root.animate(
          [
            { transform: "scale(0.82)", opacity: 0.4, filter: "blur(6px)" },
            { transform: "scale(1.06)", opacity: 1, filter: "blur(0px)", offset: 0.72 },
            { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
          ],
          { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
        )
      );
    }

    // Count + ring fill with overshoot
    function fillFrame(now) {
      if (stopped) return;
      const p = Math.min(1, (now - start) / duration);
      // ease-out expo + slight overshoot near end
      const eased = 1 - Math.pow(1 - p, 4);
      let val = level * eased;
      if (p > 0.82 && p < 1) {
        const o = Math.sin((p - 0.82) / 0.18 * Math.PI);
        val = Math.min(100, level + o * 2.2);
      }
      if (p >= 1) val = level;

      if (pctEl) pctEl.textContent = String(Math.round(val));
      if (fg) {
        const t = Math.min(1, val / 100);
        fg.style.strokeDashoffset = String(circ * (1 - t));
        // glow intensity tracks fill
        const glow = 4 + t * 14;
        fg.style.filter = `drop-shadow(0 0 ${glow}px rgba(220,38,38,${0.35 + t * 0.45}))`;
      }
      if (p < 1) raf = requestAnimationFrame(fillFrame);
      else {
        if (pctEl) pctEl.textContent = String(Math.round(level));
        if (fg) fg.style.strokeDashoffset = String(circ * (1 - level / 100));
        startHeartbeat();
      }
    }
    raf = requestAnimationFrame(fillFrame);

    function startHeartbeat() {
      if (stopped) return;
      root.classList.add("is-urgency-beating");

      // Heartbeat on ring wrap: lub-dub
      if (ringWrap?.animate) {
        anims.push(
          ringWrap.animate(
            [
              { transform: "scale(1)", offset: 0 },
              { transform: "scale(1.07)", offset: 0.12 },
              { transform: "scale(0.98)", offset: 0.22 },
              { transform: "scale(1.05)", offset: 0.34 },
              { transform: "scale(1)", offset: 0.5 },
              { transform: "scale(1)", offset: 1 },
            ],
            { duration: 1400, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }

      // Core number soft pulse
      if (core?.animate) {
        anims.push(
          core.animate(
            [
              { transform: "scale(1)", textShadow: "0 0 0 rgba(185,28,28,0)" },
              { transform: "scale(1.08)", textShadow: "0 0 18px rgba(239,68,68,0.55)" },
              { transform: "scale(1)", textShadow: "0 0 0 rgba(185,28,28,0)" },
            ],
            { duration: 1400, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }

      // Label chip pulse
      if (label?.animate) {
        anims.push(
          label.animate(
            [
              { transform: "scale(1)", boxShadow: "0 4px 14px rgba(185,28,28,0.35)" },
              { transform: "scale(1.06)", boxShadow: "0 8px 22px rgba(220,38,38,0.55)" },
              { transform: "scale(1)", boxShadow: "0 4px 14px rgba(185,28,28,0.35)" },
            ],
            { duration: 1400, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }

      // Aura breathe
      if (aura?.animate) {
        anims.push(
          aura.animate(
            [
              { transform: "scale(0.92)", opacity: 0.35 },
              { transform: "scale(1.18)", opacity: 0.72 },
              { transform: "scale(0.92)", opacity: 0.35 },
            ],
            { duration: 1400, iterations: Infinity, easing: "ease-in-out" }
          )
        );
      }

      // Expanding ripple rings (CSS class + staggered WAAPI)
      const rippleNodes = [...root.querySelectorAll(".urgency-ripple")];
      rippleNodes.forEach((node, i) => {
        if (!node.animate) return;
        anims.push(
          node.animate(
            [
              { transform: "scale(0.55)", opacity: 0.55 },
              { transform: "scale(1.35)", opacity: 0 },
            ],
            {
              duration: 1600,
              delay: i * 420,
              iterations: Infinity,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }
          )
        );
      });

      // Micro jitter on the % when "critical" — keeps attention without faking change
      const liveStart = performance.now();
      function liveFrame(now) {
        if (stopped) return;
        const t = (now - liveStart) / 1000;
        // subtle sine wobble on stroke glow only
        if (fg) {
          const w = 10 + Math.sin(t * 3.2) * 4 + Math.sin(t * 7.1) * 2;
          const a = 0.55 + Math.sin(t * 2.4) * 0.2;
          fg.style.filter = `drop-shadow(0 0 ${w}px rgba(220,38,38,${a}))`;
        }
        // occasional 1% flicker feel without lying: flash class
        if (Math.sin(t * 1.7) > 0.992) {
          root.classList.add("is-urgency-flash");
          window.setTimeout(() => root.classList.remove("is-urgency-flash"), 120);
        }
        liveRaf = requestAnimationFrame(liveFrame);
      }
      liveRaf = requestAnimationFrame(liveFrame);

      // Soft stamp once at critical
      if (level >= 90) {
        window.setTimeout(() => {
          if (stopped) return;
          stamp(root.closest(".result-card") || root, level >= 96 ? "CRÍTICO" : "ALTO");
        }, 200);
      }
    }

    function stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(liveRaf);
      anims.forEach((a) => {
        try {
          a.cancel();
        } catch (_) {}
      });
      root.classList.remove("is-urgency-live", "is-urgency-beating", "is-urgency-flash", "is-urgency-static");
      if (ringWrap) ringWrap.style.transform = "";
      if (core) {
        core.style.transform = "";
        core.style.textShadow = "";
      }
      if (label) {
        label.style.transform = "";
        label.style.boxShadow = "";
      }
      if (fg) fg.style.filter = "";
      root._urgencyStop = null;
    }

    root._urgencyStop = stop;
    return stop;
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
    urgencyMeter,
    pickPop,
    screenShake,
    pageFlash,
  };
})();
