/**
 * Funil de quiz — método completo:
 * hero → etapas (ice/pain/desire/bridge + micros) → eval → capture → loading → pitch
 */
(() => {
  const FLOW = window.QUIZ_FLOW;
  const HOTMART = window.HOTMART_URL || "https://pay.hotmart.com/P106744435B";
  const IMG = window.IMG_BASE || "assets/images/";
  const M = window.QuizMotion;

  const state = {
    lang: detectLang(),
    phase: "hero", // hero | step
    stepIndex: 0,
    answers: [],
    score: 0,
    lead: null,
    transitioning: false,
  };

  const el = {
    progressWrap: document.getElementById("progress-wrap"),
    progressBar: document.getElementById("progress-bar"),
    progressCount: document.getElementById("progress-count"),
    langBtns: document.querySelectorAll("[data-lang]"),
    langGroup: document.querySelector(".lang"),
    metaDesc: document.querySelector('meta[name="description"]'),
    screen: document.getElementById("screen"),
    sticky: null,
  };

  function detectLang() {
    const saved = localStorage.getItem("quiz-lang");
    if (saved && FLOW[saved]) return saved;
    return "es";
  }

  function pack() {
    return FLOW[state.lang] || FLOW.es;
  }

  function ui() {
    return pack().ui;
  }

  function steps() {
    return pack().steps || [];
  }

  function totalSteps() {
    return steps().length;
  }

  function currentStep() {
    return steps()[state.stepIndex] || null;
  }

  function localeTag() {
    if (state.lang === "pt") return "pt-BR";
    if (state.lang === "en") return "en-US";
    return "es-ES";
  }

  function img(name) {
    return `${IMG}${name}`;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setLang(lang) {
    if (!FLOW[lang]) return;
    state.lang = lang;
    localStorage.setItem("quiz-lang", lang);
    applyChrome();
    paint({ instant: true });
  }

  function applyChrome() {
    const u = ui();
    document.documentElement.lang = localeTag();
    if (u.metaTitle) document.title = u.metaTitle;
    if (el.metaDesc && u.metaDescription) el.metaDesc.setAttribute("content", u.metaDescription);
    if (el.langGroup && u.langAria) el.langGroup.setAttribute("aria-label", u.langAria);
    el.langBtns.forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function updateProgress() {
    const on = state.phase === "step";
    el.progressWrap.classList.toggle("is-on", on);
    if (!on) {
      el.progressBar.style.width = "0%";
      el.progressCount.textContent = "";
      return;
    }
    const n = Math.min(state.stepIndex + 1, totalSteps());
    const tot = totalSteps();
    el.progressBar.style.width = `${Math.round((n / tot) * 100)}%`;
    el.progressCount.textContent = (ui().progressOf || "{n}/{total}")
      .replace("{n}", String(n))
      .replace("{total}", String(tot));
  }

  function trackFunnel(key) {
    if (window.QuizAnalytics && typeof window.QuizAnalytics.track === "function") {
      window.QuizAnalytics.track(key, { oncePerSession: true });
    }
  }

  function trackStepAnalytics() {
    if (state.phase === "hero") {
      trackFunnel("visit");
      return;
    }
    const s = currentStep();
    if (!s) return;
    if (s.type === "question") trackFunnel(s.id);
    else if (s.type === "micro") trackFunnel(s.id);
    else if (s.type === "eval") trackFunnel("eval");
    else if (s.type === "capture") trackFunnel("capture");
    else if (s.type === "loading") trackFunnel("loading");
    else if (s.type === "pitch") trackFunnel("result");
  }

  function trackMeta() {
    const name =
      state.phase === "hero"
        ? "quiz_hero"
        : "quiz_" + (currentStep()?.id || currentStep()?.type || "step");
    if (typeof window.metaTrackPageView === "function") window.metaTrackPageView(name);
    else if (typeof fbq === "function") fbq("track", "PageView", { content_name: name });
  }

  function ensureSticky(show, label) {
    let bar = document.getElementById("sticky-cta");
    if (!show) {
      if (bar) bar.remove();
      document.body.classList.remove("has-sticky-cta");
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sticky-cta";
      bar.className = "sticky-cta";
      document.body.appendChild(bar);
    }
    document.body.classList.add("has-sticky-cta");
    bar.innerHTML = `<a class="btn-primary btn-accent" href="${HOTMART}" target="_blank" rel="noopener noreferrer" id="sticky-hotmart">${escapeHtml(label)}</a>`;
    document.getElementById("sticky-hotmart").addEventListener("click", () => trackFunnel("cta_checkout"));
  }

  async function goPhase(phase, patch) {
    if (state.transitioning) return;
    state.transitioning = true;
    await M.leave(el.screen);
    if (patch) patch();
    state.phase = phase;
    await paint({ enterMode: phase === "hero" ? "up" : "slide" });
    state.transitioning = false;
  }

  async function goStep(index, enterMode) {
    if (state.transitioning) return;
    state.transitioning = true;
    await M.leave(el.screen);
    state.phase = "step";
    state.stepIndex = index;
    await paint({ enterMode: enterMode || "slide" });
    state.transitioning = false;
  }

  function nextAfterAnswer() {
    const next = state.stepIndex + 1;
    if (next >= totalSteps()) return;
    goStep(next);
  }

  async function paint(opts = {}) {
    updateProgress();
    el.screen.classList.add("is-active");
    el.screen.style.opacity = "1";
    ensureSticky(false);

    if (state.phase === "hero") {
      renderHero();
    } else {
      const s = currentStep();
      if (!s) {
        state.phase = "hero";
        renderHero();
      } else if (s.type === "question") renderQuestion(s);
      else if (s.type === "micro") renderMicro(s);
      else if (s.type === "eval") renderEval();
      else if (s.type === "capture") renderCapture();
      else if (s.type === "loading") await renderLoading();
      else if (s.type === "pitch") renderPitch();
    }

    trackMeta();
    trackStepAnalytics();

    if (!opts.instant) {
      const mode =
        currentStep()?.type === "micro"
          ? "slam"
          : currentStep()?.type === "pitch" || currentStep()?.type === "eval"
            ? "up"
            : opts.enterMode || "slide";
      if (state.phase === "step" && currentStep()?.type === "loading") {
        /* loading has own animation */
      } else {
        await M.enter(el.screen, mode);
      }
    }

    if (state.phase === "step" && currentStep()?.type === "micro" && !opts.instant) {
      await runMicroEffects();
    }
  }

  function renderHero() {
    const u = ui();
    el.screen.innerHTML = `
      <article class="hero-card">
        <div class="hero-media" data-reveal>
          <img src="${img("scene-home.jpg")}" alt="" width="800" height="550" loading="eager" />
          <span class="hero-kicker">${escapeHtml(u.heroKicker)}</span>
        </div>
        <div class="hero-body">
          <h1 data-reveal>${escapeHtml(u.heroTitle)}</h1>
          <p class="lead" data-reveal>${escapeHtml(u.heroLead)}</p>
          <p class="sub" data-reveal>${escapeHtml(u.heroSub)}</p>
          <div class="trust-row" data-reveal>
            <span>${escapeHtml(u.trust1)}</span>
            <span>${escapeHtml(u.trust2)}</span>
            <span>${escapeHtml(u.trust3)}</span>
          </div>
          <button type="button" class="btn-primary" id="btn-start" data-reveal>${escapeHtml(u.startCta)}</button>
        </div>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 70);
    M.pulseCta(document.getElementById("btn-start"));
    document.getElementById("btn-start").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      trackFunnel("start");
      goStep(0, "slide");
    });
  }

  function blockLabel(block) {
    const map = {
      es: { ice: "Rompehielo", pain: "Dolor", desire: "Deseo", bridge: "Puente" },
      pt: { ice: "Quebra-gelo", pain: "Dor", desire: "Desejo", bridge: "Ponte" },
      en: { ice: "Icebreaker", pain: "Pain", desire: "Desire", bridge: "Bridge" },
    };
    return (map[state.lang] || map.es)[block] || "";
  }

  function renderQuestion(s) {
    const u = ui();
    const caption = (u.qCaption && u.qCaption[s.caption]) || "";
    const bl = blockLabel(s.block);
    el.screen.innerHTML = `
      <article class="q-card">
        <div class="q-media" data-reveal>
          <img src="${img(s.image)}" alt="" width="800" height="500" />
          <span class="q-caption">${escapeHtml(caption)}</span>
        </div>
        <div class="q-body">
          ${bl ? `<p class="block-chip" data-reveal>${escapeHtml(bl)}</p>` : ""}
          <h2 data-reveal>${escapeHtml(s.title)}</h2>
          <p class="q-help" data-reveal>${escapeHtml(s.help)}</p>
          <div class="options" role="group">
            ${(s.options || [])
              .map(
                (o, i) =>
                  `<button type="button" class="option" data-opt="${i}" data-reveal>${escapeHtml(o.text)}</button>`
              )
              .join("")}
          </div>
        </div>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 55);
    el.screen.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (state.transitioning) return;
        const opt = s.options[Number(btn.dataset.opt)];
        M.ripple(btn, e);
        M.pickPop?.(btn);
        btn.classList.add("is-picked");
        el.screen.querySelectorAll(".option").forEach((b) => (b.disabled = true));
        state.answers.push({ qid: s.id, opt: opt.id, block: s.block });
        state.score += opt.weight || 0;
        setTimeout(() => nextAfterAnswer(), M.reduced?.() ? 60 : 320);
      });
    });
  }

  function renderMicro(s) {
    // Reuse news card styles by layout
    const dateShort = new Date().toLocaleDateString(localeTag(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const dateLong = new Date().toLocaleDateString(localeTag(), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const region =
      state.lang === "en" ? "Latin America" : "América Latina";

    if (s.layout === "tv") {
      el.screen.innerHTML = `
        <article class="tv-card" id="news-root">
          <div class="tv-bezel"><div class="tv-screen">
            <img src="${img(s.image)}" alt="" />
            <div class="tv-scan"></div>
            <div class="tv-topbar"><span class="tv-channel">${escapeHtml(s.paper || "")}</span>
            <span class="tv-clock">${escapeHtml(dateShort)}</span></div>
            <div class="tv-lower"><span class="tv-badge">${escapeHtml(s.stamp || "")}</span>
            <span class="tv-cat">${escapeHtml(s.category || "")}</span></div>
            <div class="tv-ticker-line"><span>${escapeHtml(region)} · ${escapeHtml(dateLong)}</span></div>
          </div></div>
          <div class="tv-panel">
            <h2 class="paper-headline" id="paper-headline"></h2>
            <p class="paper-lead" data-reveal>${escapeHtml(s.body)}</p>
            <blockquote class="paper-quote" data-reveal><p>${escapeHtml(s.quote || "")}</p>
            <cite>${escapeHtml(s.quoteBy || "")}</cite></blockquote>
            <ul class="paper-bullets">${(s.bullets || []).map((b) => `<li data-reveal>${escapeHtml(b)}</li>`).join("")}</ul>
            <button type="button" class="btn-primary btn-accent" id="btn-micro" data-reveal>${escapeHtml(s.cta || ui().continueCta)}</button>
          </div>
        </article>`;
    } else if (s.layout === "magazine") {
      el.screen.innerHTML = `
        <article class="mag-card" id="news-root">
          <div class="mag-cover">
            <img src="${img(s.image)}" alt="" />
            <div class="mag-cover-meta">
              <span class="mag-issue">${escapeHtml(dateShort)}</span>
              <span class="mag-brand">${escapeHtml(s.paper || "")}</span>
            </div>
            <span class="mag-sticker">${escapeHtml(s.stamp || "")}</span>
          </div>
          <div class="mag-body">
            <p class="mag-kicker">${escapeHtml(s.category || "")} · ${escapeHtml(region)}</p>
            <h2 class="paper-headline" id="paper-headline"></h2>
            <p class="paper-lead" data-reveal>${escapeHtml(s.body)}</p>
            <blockquote class="paper-quote" data-reveal><p>${escapeHtml(s.quote || "")}</p>
            <cite>${escapeHtml(s.quoteBy || "")}</cite></blockquote>
            <ul class="paper-bullets">${(s.bullets || []).map((b) => `<li data-reveal>${escapeHtml(b)}</li>`).join("")}</ul>
            <button type="button" class="btn-primary btn-accent" id="btn-micro" data-reveal>${escapeHtml(s.cta || ui().continueCta)}</button>
          </div>
        </article>`;
    } else {
      // paper | insight
      el.screen.innerHTML = `
        <article class="paper" id="news-root">
          <header class="paper-head">
            <div class="paper-head-row">
              <span class="paper-name">${escapeHtml(s.paper || s.source || "")}</span>
              <span class="paper-date-badge">${escapeHtml(dateShort)}</span>
            </div>
            <p class="paper-date-long">${escapeHtml(dateLong)}</p>
            <div class="paper-rule"></div>
            <div class="paper-kicker">
              <span class="paper-cat">${escapeHtml(s.category || s.ribbon || "")}</span>
              <span class="paper-dateline">${escapeHtml(region)}</span>
            </div>
          </header>
          <div class="paper-media"><img src="${img(s.image)}" alt="" /></div>
          <div class="paper-body">
            <h2 class="paper-headline" id="paper-headline"></h2>
            <p class="paper-lead" data-reveal>${escapeHtml(s.body)}</p>
            <blockquote class="paper-quote" data-reveal><p>${escapeHtml(s.quote || "")}</p>
            <cite>${escapeHtml(s.quoteBy || "")}</cite></blockquote>
            <ul class="paper-bullets">${(s.bullets || []).map((b) => `<li data-reveal>${escapeHtml(b)}</li>`).join("")}</ul>
            <button type="button" class="btn-primary btn-accent" id="btn-micro" data-reveal>${escapeHtml(s.cta || ui().continueCta)}</button>
          </div>
        </article>`;
    }
    document.getElementById("btn-micro").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      nextAfterAnswer();
    });
  }

  async function runMicroEffects() {
    const s = currentStep();
    const root = document.getElementById("news-root");
    const headline = document.getElementById("paper-headline");
    if (headline && s?.title) {
      if (M.typewriter) await M.typewriter(headline, s.title, 12);
      else headline.textContent = s.title;
    }
    if (root && M.stamp && s?.stamp) M.stamp(root, s.stamp);
    if (root && M.pageFlash) M.pageFlash(root);
    M.stagger?.(el.screen, "[data-reveal]", 80);
    M.pulseCta?.(document.getElementById("btn-micro"));
  }

  function tagsFromAnswers() {
    const tags = [];
    const seen = new Set();
    // rebuild from current lang questions
    state.answers.forEach((a) => {
      const q = steps().find((x) => x.type === "question" && x.id === a.qid);
      const opt = q?.options?.find((o) => o.id === a.opt);
      (opt?.tags || []).forEach((t) => {
        if (!seen.has(t)) {
          seen.add(t);
          tags.push(t);
        }
      });
    });
    const defaults = ui().resultTagsDefault || [];
    while (tags.length < 3) tags.push(defaults[tags.length] || defaults[0] || "—");
    return tags.slice(0, 6);
  }

  function attentionLevel() {
    return Math.min(99, Math.max(86, 88 + Math.min(11, Math.floor((state.score || 24) / 8))));
  }

  function renderEval() {
    const u = ui();
    const tags = tagsFromAnswers();
    const level = attentionLevel();
    el.screen.innerHTML = `
      <article class="result-card eval-card">
        <div class="result-hero">
          <span class="badge-critical" data-reveal>${escapeHtml(u.evalBadge)}</span>
          <div class="result-level" data-reveal>
            <div class="result-level-ring">
              <svg viewBox="0 0 100 100">
                <circle class="result-level-bg" cx="50" cy="50" r="42"></circle>
                <circle class="result-level-fg" id="result-level-fg" cx="50" cy="50" r="42"></circle>
              </svg>
              <div class="result-level-core"><span id="result-level-pct">0</span><small>%</small></div>
            </div>
            <p class="result-level-label">${escapeHtml((u.meterLabels && u.meterLabels[2]) || "Urgencia")}</p>
          </div>
          <h2 data-reveal>${escapeHtml(u.evalTitle)}</h2>
          <p data-reveal>${escapeHtml(u.evalLead)}</p>
          <div class="tags" data-reveal>${tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <button type="button" class="btn-primary btn-accent" id="btn-eval" data-reveal>${escapeHtml(u.evalCta)}</button>
        </div>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 70);
    const fg = document.getElementById("result-level-fg");
    const circ = 2 * Math.PI * 42;
    if (fg) {
      fg.style.strokeDasharray = String(circ);
      fg.style.strokeDashoffset = String(circ);
      requestAnimationFrame(() => {
        fg.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)";
        fg.style.strokeDashoffset = String(circ * (1 - level / 100));
      });
    }
    M.countUp?.(document.getElementById("result-level-pct"), level, { duration: 1100 });
    document.getElementById("btn-eval").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      nextAfterAnswer();
    });
  }

  function renderCapture() {
    const u = ui();
    el.screen.innerHTML = `
      <article class="funnel-card capture-card">
        <div class="funnel-body">
          <p class="funnel-kicker" data-reveal>Lead</p>
          <h1 data-reveal>${escapeHtml(u.captureTitle)}</h1>
          <p class="funnel-lead" data-reveal>${escapeHtml(u.captureLead)}</p>
          <form id="lead-form" class="lead-form" data-reveal>
            <label><span>${escapeHtml(u.captureName)}</span>
              <input name="name" type="text" autocomplete="name" required /></label>
            <label><span>${escapeHtml(u.captureEmail)}</span>
              <input name="email" type="email" autocomplete="email" required /></label>
            <label><span>${escapeHtml(u.capturePhone)}</span>
              <input name="phone" type="tel" autocomplete="tel" required /></label>
            <p class="lead-error" id="lead-error" hidden>${escapeHtml(u.captureError)}</p>
            <button type="submit" class="btn-primary btn-accent">${escapeHtml(u.captureCta)}</button>
            <p class="funnel-footer">${escapeHtml(u.captureNote)}</p>
          </form>
        </div>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 60);
    document.getElementById("lead-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const err = document.getElementById("lead-error");
      if (!name || !email || !phone) {
        if (err) err.hidden = false;
        return;
      }
      state.lead = { name, email, phone, ts: Date.now(), lang: state.lang };
      try {
        const leads = JSON.parse(localStorage.getItem("birra_leads") || "[]");
        leads.push(state.lead);
        localStorage.setItem("birra_leads", JSON.stringify(leads.slice(-200)));
      } catch (_) {}
      trackFunnel("lead_capture");
      nextAfterAnswer();
    });
  }

  async function renderLoading() {
    const u = ui();
    el.screen.innerHTML = `
      <div class="loading-screen" id="loading-root">
        <div class="loading-spinner"></div>
        <p class="loading-kicker" id="loading-status">${escapeHtml(u.analyzeLoading)}</p>
        <h2>${escapeHtml(u.analyzeTitle)}</h2>
        <p class="loading-sub">${escapeHtml(u.analyzeText)}</p>
        <div class="loading-bar-wrap">
          <div class="loading-bar-track"><div class="loading-bar-fill" id="loading-bar-fill"></div></div>
          <span class="loading-bar-pct" id="loading-bar-pct">0%</span>
        </div>
      </div>`;
    const reduced = M.reduced?.() || false;
    const duration = reduced ? 400 : 2800;
    const fill = document.getElementById("loading-bar-fill");
    const pct = document.getElementById("loading-bar-pct");
    const start = performance.now();
    await new Promise((resolve) => {
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const v = Math.round((1 - Math.pow(1 - p, 2)) * 100);
        if (fill) fill.style.width = v + "%";
        if (pct) pct.textContent = v + "%";
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
    nextAfterAnswer();
  }

  function renderPitch() {
    const u = ui();
    const tags = tagsFromAnswers();
    const level = attentionLevel();
    const blocks = u.pitchBlocks || {};
    const order = ["promise", "authority", "mechanism", "anchor", "offer", "guarantee", "faq"];
    const labels = u.meterLabels || [];
    const vals = [Math.min(99, level - 2), Math.min(99, level - 5), Math.min(99, level)];

    el.screen.innerHTML = `
      <article class="result-card pitch-card" id="result-root">
        <div class="result-hero">
          <span class="badge-critical" data-reveal>⚡ ${escapeHtml(u.resultBadge)}</span>
          <div class="result-level" data-reveal>
            <div class="result-level-ring">
              <svg viewBox="0 0 100 100">
                <circle class="result-level-bg" cx="50" cy="50" r="42"></circle>
                <circle class="result-level-fg" id="result-level-fg" cx="50" cy="50" r="42"></circle>
              </svg>
              <div class="result-level-core"><span id="result-level-pct">0</span><small>%</small></div>
            </div>
            <p class="result-level-label">${escapeHtml(labels[2] || "Urgencia")}</p>
          </div>
          <h2 data-reveal>${escapeHtml(u.resultTitle)}</h2>
          <p data-reveal>${escapeHtml(u.resultLead)}</p>
        </div>
        <div class="result-body">
          <div class="result-meters" data-reveal>
            ${labels
              .map(
                (label, i) => `
              <div class="analyze-meter-row">
                <div class="analyze-meter-top">
                  <span>${escapeHtml(label)}</span>
                  <strong class="analyze-meter-val" data-mval="${vals[i]}">0%</strong>
                </div>
                <div class="analyze-meter-track">
                  <div class="analyze-meter-fill" data-meter="${vals[i]}"></div>
                </div>
              </div>`
              )
              .join("")}
          </div>
          <div class="tags" data-reveal>${tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <ul class="result-list">
            ${(u.resultPoints || []).map((p) => `<li data-reveal>${escapeHtml(p)}</li>`).join("")}
          </ul>

          <p class="funnel-kicker" data-reveal>${escapeHtml(u.pitchBadge)}</p>
          <div class="pitch-grid">
            ${order
              .map((key, i) => {
                const b = blocks[key];
                if (!b) return "";
                return `<div class="pitch-block" data-reveal>
                  <span class="pitch-num">${i + 1}</span>
                  <div><h3>${escapeHtml(b.t)}</h3><p>${escapeHtml(b.d)}</p></div>
                </div>`;
              })
              .join("")}
          </div>

          <a class="btn-primary btn-accent" id="btn-hotmart" href="${HOTMART}" target="_blank" rel="noopener noreferrer" data-reveal>
            ${escapeHtml(u.ctaSolution || u.stickyCta)}
          </a>
          <p class="price-note" data-reveal>${escapeHtml(u.priceNote || "")}</p>
          <p class="footer-note" data-reveal>${escapeHtml(u.footerNote || "")}</p>
        </div>
      </article>`;

    ensureSticky(true, u.stickyCta || u.ctaSolution);
    M.stagger(el.screen, "[data-reveal]", 55);
    const cta = document.getElementById("btn-hotmart");
    M.pulseCta?.(cta);
    cta?.addEventListener("click", () => trackFunnel("cta_checkout"));

    const fg = document.getElementById("result-level-fg");
    const circ = 2 * Math.PI * 42;
    if (fg) {
      fg.style.strokeDasharray = String(circ);
      fg.style.strokeDashoffset = String(circ);
      requestAnimationFrame(() => {
        fg.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)";
        fg.style.strokeDashoffset = String(circ * (1 - level / 100));
      });
    }
    M.countUp?.(document.getElementById("result-level-pct"), level, { duration: 1200 });
    el.screen.querySelectorAll("[data-meter]").forEach((m, i) => {
      const target = Number(m.dataset.meter) || 90;
      setTimeout(() => {
        m.style.width = target + "%";
        const valEl = el.screen.querySelectorAll("[data-mval]")[i];
        if (valEl) M.countUp?.(valEl, target, { duration: 900, suffix: "%" });
      }, 200 + i * 140);
    });
  }

  el.langBtns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  applyChrome();
  paint({ enterMode: "up", instant: false });
})();
