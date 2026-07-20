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

  const TYNK_EMBED = "https://play.tynk.ai/p/4b116b35-b926-4aaa-8eff-56bf3e917a38";

  /** Etapa de prova social (vídeo Tynk) — no meio do funil, após o bloco de dor. */
  function socialStep() {
    const copy = {
      es: {
        badge: "Historia real",
        title: "Mamá que ya recuperó el control en casa",
        name: "Valentina Rojas",
        role: "Madre de 2 hijos · México",
        quote:
          "Escucha a Valentina: en pocos días dejó de reaccionar tarde y recuperó el mando en las crisis.",
        cta: "CONTINUAR EL TEST",
      },
      pt: {
        badge: "História real",
        title: "Mãe que já recuperou o controle em casa",
        name: "Valentina Rojas",
        role: "Mãe de 2 filhos · México",
        quote:
          "Ouça a Valentina: em poucos dias parou de reagir tarde e recuperou o comando nas crises.",
        cta: "CONTINUAR O TESTE",
      },
      en: {
        badge: "Real story",
        title: "A mom who got control back at home",
        name: "Valentina Rojas",
        role: "Mother of 2 · Mexico",
        quote:
          "Hear Valentina: in a few days she stopped reacting late and took back command in crises.",
        cta: "CONTINUE THE QUIZ",
      },
    };
    const c = copy[state.lang] || copy.es;
    return {
      type: "social",
      id: "social_video",
      embed: TYNK_EMBED,
      ...c,
    };
  }

  function steps() {
    const raw = pack().steps || [];
    if (raw.some((s) => s.id === "social_video" || s.type === "social")) return raw;
    const out = [];
    for (const s of raw) {
      out.push(s);
      // No meio do funil: depois da micro de dor (antes do bloco desejo)
      if (s.id === "m_pain") out.push(socialStep());
    }
    return out;
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

  /**
   * Foto única e impactante por pergunta (sem repetir a mesma cena).
   * Sobrescreve o image do flow quando existir mapeamento.
   */
  const SCENE_BY_Q = {
    q1: "scene-q1.jpg",
    q2: "scene-q2.jpg",
    q3: "scene-q3-who.jpg",
    q4: "scene-q4b.jpg",
    q5: "scene-q5.jpg",
    q6: "scene-q6-honest.jpg",
    q7: "scene-super.jpg",
    q8: "scene-screens.jpg",
    q9: "scene-q9.jpg",
    q10: "scene-public.jpg",
    q11: "scene-escalation.jpg",
    q12: "scene-q12.jpg",
    q13: "scene-guilt.jpg",
    q14: "scene-q14-family.jpg",
    q15: "scene-q15-exhaust.jpg",
    q16: "scene-q16-worst.jpg",
    q17: "scene-calm.jpg",
    q18: "scene-q18-recover.jpg",
    q19: "scene-q19-super-ready.jpg",
    q20: "scene-q20-protocol.jpg",
    q21: "scene-q21-master.jpg",
    q22: "scene-q22-14days.jpg",
    q23: "scene-q23-choice.jpg",
    q24: "scene-q24-script.jpg",
    q25: "scene-q25-yelling.jpg",
    q26: "scene-q26-freeze.jpg",
    q27: "scene-q27-sequence.jpg",
    q28: "scene-q28-limits.jpg",
    q29: "scene-q29-everywhere.jpg",
    q30: "scene-q30-ready.jpg",
  };

  const SCENE_BY_MICRO = {
    m_ice: "scene-news.jpg",
    m_pain: "scene-news3.jpg",
    m_desire: "scene-home.jpg",
    m_bridge: "scene-tv.jpg",
  };

  function sceneFor(s) {
    if (!s) return "";
    if (s.type === "question" && SCENE_BY_Q[s.id]) return SCENE_BY_Q[s.id];
    if (s.type === "micro" && SCENE_BY_MICRO[s.id]) return SCENE_BY_MICRO[s.id];
    return s.image || "";
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
    else if (s.type === "social") trackFunnel(s.id || "social_video");
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
    // Se já estamos animando (ex.: loading → pitch), enfileira o próximo passo
    if (state.transitioning) {
      state.pendingStepIndex = index;
      return;
    }
    state.transitioning = true;
    try {
      await M.leave(el.screen);
      state.phase = "step";
      state.stepIndex = index;
      await paint({ enterMode: enterMode || "slide" });
    } finally {
      state.transitioning = false;
    }
    if (state.pendingStepIndex != null && state.pendingStepIndex !== state.stepIndex) {
      const next = state.pendingStepIndex;
      state.pendingStepIndex = null;
      goStep(next);
    } else {
      state.pendingStepIndex = null;
    }
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
      else if (s.type === "social") renderSocial(s);
      else if (s.type === "eval") renderEval();
      else if (s.type === "capture") renderCapture();
      else if (s.type === "loading") await renderLoading();
      else if (s.type === "pitch") renderPitch();
    }

    trackMeta();
    trackStepAnalytics();

    if (!opts.instant) {
      const mode =
        currentStep()?.type === "micro" || currentStep()?.type === "social"
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

  function renderSocial(s) {
    const embed = s.embed || TYNK_EMBED;
    el.screen.innerHTML = `
      <article class="social-card" id="social-root">
        <p class="social-badge" data-reveal>${escapeHtml(s.badge || "")}</p>
        <h2 data-reveal>${escapeHtml(s.title || "")}</h2>
        <div class="social-person" data-reveal>
          <span class="social-avatar" aria-hidden="true">${escapeHtml((s.name || "V").charAt(0))}</span>
          <div>
            <strong class="social-name">${escapeHtml(s.name || "")}</strong>
            <p class="social-role">${escapeHtml(s.role || "")}</p>
          </div>
        </div>
        <div class="social-video-wrap social-embed-wrap" data-reveal>
          <iframe
            class="social-embed"
            src="${escapeHtml(embed)}"
            title="${escapeHtml(s.name || "Video")}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="social-quote" data-reveal>${escapeHtml(s.quote || "")}</p>
        <button type="button" class="btn-primary btn-accent" id="btn-social" data-reveal>${escapeHtml(
          s.cta || ui().continueCta
        )}</button>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 60);
    document.getElementById("btn-social").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      nextAfterAnswer();
    });
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

  function renderQuestion(s) {
    const u = ui();
    const caption = (u.qCaption && u.qCaption[s.caption]) || "";
    const photo = sceneFor(s);
    el.screen.innerHTML = `
      <article class="q-card">
        <div class="q-media" data-reveal>
          <img src="${img(photo)}" alt="" width="800" height="500" loading="eager" />
          <span class="q-caption">${escapeHtml(caption)}</span>
        </div>
        <div class="q-body">
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
    const photo = sceneFor(s);
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
            <img src="${img(photo)}" alt="" />
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
            <img src="${img(photo)}" alt="" />
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
          <div class="paper-media"><img src="${img(photo)}" alt="" /></div>
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

  /** Espelho personalizado (etapa Avaliação do funil): devolve a vida do lead para ele. */
  function mirrorText(tags, level) {
    const t = (tags || []).join(" · ");
    if (state.lang === "pt") {
      return `Pelas suas respostas, o nível de urgência está em ${level}%. Padrões que aparecem com mais força: ${t || "reação tardia e roteiro errado"}. Você não está “falhando como pai/mãe” — está reagindo tarde e, muitas vezes, sem método. Quando a birra manda, a casa inteira paga o preço.`;
    }
    if (state.lang === "en") {
      return `Based on your answers, urgency is at ${level}%. Strongest patterns: ${t || "late reaction and the wrong script"}. You're not “failing as a parent” — you're reacting late, often without a method. When the tantrum runs the house, everyone pays.`;
    }
    return `Según tus respuestas, la urgencia está en ${level}%. Patrones más fuertes: ${t || "reacción tardía y guion equivocado"}. No estás “fallando como padre/madre” — reaccionas tarde y, a menudo, sin método. Cuando el berrinche manda, paga toda la casa.`;
  }

  function renderEval() {
    const u = ui();
    const tags = tagsFromAnswers();
    const level = attentionLevel();
    const mirror = mirrorText(tags, level);
    el.screen.innerHTML = `
      <article class="result-card eval-card">
        <div class="result-hero">
          <span class="badge-critical" data-reveal>${escapeHtml(u.evalBadge)}</span>
          <div class="result-level result-level-urgent" id="urgency-meter-eval" data-reveal>
            <div class="urgency-ripples" aria-hidden="true">
              <i class="urgency-ripple"></i><i class="urgency-ripple"></i><i class="urgency-ripple"></i>
            </div>
            <div class="urgency-aura" aria-hidden="true"></div>
            <div class="result-level-ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle class="result-level-bg" cx="50" cy="50" r="42"></circle>
                <circle class="result-level-fg result-level-fg-urgent" id="result-level-fg" cx="50" cy="50" r="42"></circle>
              </svg>
              <div class="result-level-core result-level-core-urgent"><span id="result-level-pct">0</span><small>%</small></div>
            </div>
            <p class="result-level-label result-level-label-urgent">${escapeHtml((u.meterLabels && u.meterLabels[2]) || "Urgencia")}</p>
          </div>
          <h2 data-reveal>${escapeHtml(u.evalTitle)}</h2>
          <p data-reveal class="eval-mirror">${escapeHtml(mirror)}</p>
          <div class="tags" data-reveal>${tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <button type="button" class="btn-primary btn-accent" id="btn-eval" data-reveal>${escapeHtml(u.evalCta)}</button>
        </div>
      </article>`;
    M.stagger(el.screen, "[data-reveal]", 70);
    M.urgencyMeter?.(document.getElementById("urgency-meter-eval"), level, { duration: 1500 });
    document.getElementById("btn-eval").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      nextAfterAnswer();
    });
  }

  function renderCapture() {
    const u = ui();
    el.screen.innerHTML = `
      <article class="hero-card capture-card">
        <div class="hero-body">
          <h1 data-reveal style="font-size:clamp(1.25rem,5vw,1.5rem)">${escapeHtml(u.captureTitle)}</h1>
          <p class="lead" data-reveal>${escapeHtml(u.captureLead)}</p>
          <form id="lead-form" class="lead-form" data-reveal>
            <label><span>${escapeHtml(u.captureName)}</span>
              <input name="name" type="text" autocomplete="name" required /></label>
            <label><span>${escapeHtml(u.captureEmail)}</span>
              <input name="email" type="email" autocomplete="email" required /></label>
            <label><span>${escapeHtml(u.capturePhone)}</span>
              <input name="phone" type="tel" autocomplete="tel" required /></label>
            <p class="lead-error" id="lead-error" hidden>${escapeHtml(u.captureError)}</p>
            <button type="submit" class="btn-primary btn-accent">${escapeHtml(u.captureCta)}</button>
            <p class="footer-note">${escapeHtml(u.captureNote)}</p>
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
      const tags = tagsFromAnswers();
      const level = attentionLevel();
      state.lead = {
        name,
        email,
        phone,
        ts: Date.now(),
        lang: state.lang,
        score: state.score,
        level,
        tags,
      };
      try {
        if (window.LeadsStore && typeof window.LeadsStore.add === "function") {
          window.LeadsStore.add(state.lead);
        } else {
          const leads = JSON.parse(localStorage.getItem("birra_leads") || "[]");
          leads.push(state.lead);
          localStorage.setItem("birra_leads", JSON.stringify(leads.slice(-2000)));
        }
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

  function beforeAfterCopy() {
    if (state.lang === "pt") {
      return {
        title: "Imagine a virada em 14 dias",
        before: "Hoje",
        after: "Com o protocolo",
        beforeCap: "Crise no comando",
        afterCap: "Casa sob controle",
        note: "Do caos diário para manhãs com método — sem gritos nem ameaças vazias.",
      };
    }
    if (state.lang === "en") {
      return {
        title: "Picture the turnaround in 14 days",
        before: "Today",
        after: "With the protocol",
        beforeCap: "Crisis in charge",
        afterCap: "Home under control",
        note: "From daily chaos to mornings with a method — no yelling, no empty threats.",
      };
    }
    return {
      title: "Imagina el cambio en 14 días",
      before: "Hoy",
      after: "Con el protocolo",
      beforeCap: "La crisis manda",
      afterCap: "Casa bajo control",
      note: "Del caos diario a mañanas con método — sin gritos ni amenazas vacías.",
    };
  }

  function renderPitch() {
    const u = ui();
    const tags = tagsFromAnswers();
    const level = attentionLevel();
    const blocks = u.pitchBlocks || {};
    const order = ["promise", "authority", "mechanism", "anchor", "offer", "guarantee", "faq"];
    const labels = u.meterLabels || [];
    const vals = [Math.min(99, level - 2), Math.min(99, level - 5), Math.min(99, level)];
    const ba = beforeAfterCopy();
    const urgencyLabel = labels[2] || (state.lang === "pt" ? "Urgência" : state.lang === "en" ? "Urgency" : "Urgencia");

    el.screen.innerHTML = `
      <article class="result-card pitch-card is-urgent" id="result-root">
        <div class="result-hero result-hero-urgent">
          <span class="badge-critical badge-urgent" data-reveal>⚡ ${escapeHtml(u.resultBadge)}</span>
          <div class="result-level result-level-urgent" id="urgency-meter" data-reveal>
            <div class="urgency-ripples" aria-hidden="true">
              <i class="urgency-ripple"></i><i class="urgency-ripple"></i><i class="urgency-ripple"></i>
            </div>
            <div class="urgency-aura" aria-hidden="true"></div>
            <div class="result-level-ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle class="result-level-bg" cx="50" cy="50" r="42"></circle>
                <circle class="result-level-fg result-level-fg-urgent" id="result-level-fg" cx="50" cy="50" r="42"></circle>
              </svg>
              <div class="result-level-core result-level-core-urgent"><span id="result-level-pct">0</span><small>%</small></div>
            </div>
            <p class="result-level-label result-level-label-urgent">${escapeHtml(urgencyLabel)}</p>
          </div>
          <h2 data-reveal>${escapeHtml(u.resultTitle)}</h2>
          <p data-reveal>${escapeHtml(u.resultLead)}</p>
        </div>
        <div class="result-body">
          <div class="result-meters" data-reveal>
            ${labels
              .map(
                (label, i) => `
              <div class="analyze-meter-row${i === 2 ? " is-urgency" : ""}">
                <div class="analyze-meter-top">
                  <span>${escapeHtml(label)}</span>
                  <strong class="analyze-meter-val" data-mval="${vals[i]}">0%</strong>
                </div>
                <div class="analyze-meter-track">
                  <div class="analyze-meter-fill${i === 2 ? " is-urgency-fill" : ""}" data-meter="${vals[i]}"></div>
                </div>
              </div>`
              )
              .join("")}
          </div>

          <div class="before-after" data-reveal>
            <p class="before-after-title">${escapeHtml(ba.title)}</p>
            <div class="before-after-grid">
              <figure class="ba-card ba-before">
                <img src="${img("scene-q16-worst.jpg")}" alt="" width="400" height="300" loading="lazy" />
                <figcaption>
                  <span class="ba-tag ba-tag-before">${escapeHtml(ba.before)}</span>
                  <strong>${escapeHtml(ba.beforeCap)}</strong>
                </figcaption>
              </figure>
              <span class="ba-arrow" aria-hidden="true">→</span>
              <figure class="ba-card ba-after">
                <img src="${img("scene-q18-recover.jpg")}" alt="" width="400" height="300" loading="lazy" />
                <figcaption>
                  <span class="ba-tag ba-tag-after">${escapeHtml(ba.after)}</span>
                  <strong>${escapeHtml(ba.afterCap)}</strong>
                </figcaption>
              </figure>
            </div>
            <p class="before-after-note">${escapeHtml(ba.note)}</p>
          </div>

          <div class="tags" data-reveal>${tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <ul class="result-list">
            ${(u.resultPoints || []).map((p) => `<li data-reveal>${escapeHtml(p)}</li>`).join("")}
          </ul>

          <p class="block-chip" data-reveal>${escapeHtml(u.pitchBadge)}</p>
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

          <a class="btn-primary btn-accent btn-urgent-cta" id="btn-hotmart" href="${HOTMART}" target="_blank" rel="noopener noreferrer" data-reveal>
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

    // Contador de urgência com pulso / brilho / batimento (JS)
    const meter = document.getElementById("urgency-meter");
    M.urgencyMeter?.(meter, level, { duration: 1650 });

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
