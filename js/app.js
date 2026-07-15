(() => {
  const TOTAL_Q = 12;
  const HOTMART = window.HOTMART_URL;
  const IMG = window.IMG_BASE;
  const I18N = window.QUIZ_I18N;
  const M = window.QuizMotion;

  const state = {
    lang: detectLang(),
    step: "hero",
    qIndex: 0,
    answers: [], // { qid, opt }
    score: 0,
    pendingNewsId: null, // id da matéria — sempre resolvida no idioma atual
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
  };

  /** Idioma principal sempre español; só muda se o usuário escolher (e salvar). */
  function detectLang() {
    const saved = localStorage.getItem("quiz-lang");
    if (saved && I18N[saved]) return saved;
    return "es";
  }

  function t() {
    return I18N[state.lang] || I18N.es;
  }

  function localeTag() {
    if (state.lang === "pt") return "pt-BR";
    if (state.lang === "en") return "en-US";
    return "es-ES";
  }

  function todayLong() {
    return new Date().toLocaleDateString(localeTag(), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function todayShort() {
    return new Date().toLocaleDateString(localeTag(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /** Atualiza título, meta e aria do seletor — tudo no idioma atual */
  function applyDocumentLang() {
    const c = t();
    document.documentElement.lang = localeTag();
    document.title = c.metaTitle;
    if (el.metaDesc && c.metaDescription) {
      el.metaDesc.setAttribute("content", c.metaDescription);
    }
    if (el.langGroup && c.langAria) {
      el.langGroup.setAttribute("aria-label", c.langAria);
    }
    el.langBtns.forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (!I18N[lang] || lang === state.lang) return;
    state.lang = lang;
    localStorage.setItem("quiz-lang", lang);
    applyDocumentLang();
    // Re-render completo no novo idioma (notícia/tags resolvidos de novo)
    paint({ instant: true });
  }

  function updateProgress() {
    const on = state.step !== "hero";
    el.progressWrap.classList.toggle("is-on", on);
    if (!on) {
      el.progressBar.style.width = "0%";
      el.progressCount.textContent = "";
      return;
    }
    const shown =
      state.step === "result" || state.step === "analyze" ? TOTAL_Q : state.qIndex + 1;
    el.progressBar.style.width = `${Math.round((shown / TOTAL_Q) * 100)}%`;
    el.progressCount.textContent = t()
      .progressOf.replace("{n}", String(shown))
      .replace("{total}", String(TOTAL_Q));
  }

  function img(name) {
    return `${IMG}${name}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Tags sempre no idioma atual (a partir das respostas salvas por id) */
  function tagsForCurrentLang() {
    const tags = [];
    const seen = new Set();
    state.answers.forEach((a) => {
      const q = t().questions.find((item) => item.id === a.qid);
      const opt = q?.options?.find((o) => o.id === a.opt);
      (opt?.tags || []).forEach((tag) => {
        if (!seen.has(tag)) {
          seen.add(tag);
          tags.push(tag);
        }
      });
    });
    return tags;
  }

  function currentNews() {
    if (!state.pendingNewsId) return null;
    return t().news.find((n) => n.id === state.pendingNewsId) || null;
  }

  async function go(nextStep, patch) {
    if (state.transitioning) return;
    state.transitioning = true;
    await M.leave(el.screen);
    if (patch) patch();
    state.step = nextStep;
    await paint({
      enterMode:
        nextStep === "news"
          ? "slam"
          : nextStep === "result" || nextStep === "analyze"
            ? "up"
            : "slide",
    });
    state.transitioning = false;
  }

  async function paint(opts = {}) {
    updateProgress();
    el.screen.classList.add("is-active");
    el.screen.style.opacity = "1";

    if (state.step === "hero") renderHero();
    else if (state.step === "question") renderQuestion();
    else if (state.step === "news") renderNewsShell();
    else if (state.step === "analyze") renderAnalyze();
    else if (state.step === "result") renderResult();

    if (!opts.instant) {
      await M.enter(el.screen, opts.enterMode || "slide");
    }

    if (state.step === "news") {
      if (opts.instant) {
        fillNewsStatic();
      } else {
        await runNewsEffects();
      }
    }
  }

  function renderHero() {
    const c = t();
    el.screen.innerHTML = `
      <article class="hero-card">
        <div class="hero-media" data-reveal>
          <img src="${img("scene-home.jpg")}" alt="" width="800" height="550" loading="eager" />
          <span class="hero-kicker">${escapeHtml(c.heroKicker)}</span>
        </div>
        <div class="hero-body">
          <h1 data-reveal>${escapeHtml(c.heroTitle)}</h1>
          <p class="lead" data-reveal>${escapeHtml(c.heroLead)}</p>
          <p class="sub" data-reveal>${escapeHtml(c.heroSub)}</p>
          <div class="trust-row" data-reveal>
            <span>${escapeHtml(c.trust1)}</span>
            <span>${escapeHtml(c.trust2)}</span>
            <span>${escapeHtml(c.trust3)}</span>
          </div>
          <button type="button" class="btn-primary" id="btn-start" data-reveal>${escapeHtml(c.startCta)}</button>
        </div>
      </article>
    `;
    M.stagger(el.screen, "[data-reveal]", 85);
    M.pulseCta(document.getElementById("btn-start"));
    document.getElementById("btn-start").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      go("question", () => {
        state.qIndex = 0;
        state.answers = [];
        state.score = 0;
        state.pendingNewsId = null;
      });
    });
  }

  function renderQuestion() {
    const c = t();
    const q = c.questions[state.qIndex];
    if (!q) {
      goAnalyze();
      return;
    }
    const caption = c.qCaption[q.caption] || "";
    el.screen.innerHTML = `
      <article class="q-card">
        <div class="q-media" data-reveal>
          <img src="${img(q.image)}" alt="" width="800" height="500" />
          <span class="q-caption">${escapeHtml(caption)}</span>
        </div>
        <div class="q-body">
          <h2 data-reveal>${escapeHtml(q.title)}</h2>
          <p class="q-help" data-reveal>${escapeHtml(q.help)}</p>
          <div class="options" role="group" aria-label="${escapeHtml(q.title)}">
            ${q.options
              .map(
                (o, i) => `
              <button type="button" class="option" data-opt="${i}" data-reveal>
                ${escapeHtml(o.text)}
              </button>`
              )
              .join("")}
          </div>
        </div>
      </article>
    `;
    M.stagger(el.screen, "[data-reveal]", 70);

    el.screen.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (state.transitioning) return;
        const opt = q.options[Number(btn.dataset.opt)];
        M.ripple(btn, e);
        M.pickPop(btn);
        btn.classList.add("is-picked");
        el.screen.querySelectorAll(".option").forEach((b) => (b.disabled = true));
        // Só ids — o texto/tags vêm sempre do idioma atual
        state.answers.push({ qid: q.id, opt: opt.id });
        state.score += opt.weight;
        window.setTimeout(() => afterAnswer(), M.reduced() ? 60 : 380);
      });
    });
  }

  function afterAnswer() {
    const justFinished = state.qIndex + 1;
    const news = t().news.find((n) => n.afterQuestion === justFinished);
    if (news) {
      go("news", () => {
        state.pendingNewsId = news.id;
      });
      return;
    }
    if (state.qIndex >= TOTAL_Q - 1) {
      goAnalyze();
      return;
    }
    go("question", () => {
      state.qIndex += 1;
    });
  }

  function statsHtml(stats) {
    return (stats || [])
      .map(
        (s) => `
      <div class="paper-stat">
        <strong><span data-count="${s.value}" data-suffix="${escapeHtml(s.suffix || "")}">0</span></strong>
        <span>${escapeHtml(s.label)}</span>
      </div>`
      )
      .join("");
  }

  function newsSharedBody(n) {
    return `
      <h2 class="paper-headline" id="paper-headline"></h2>
      <div class="paper-stats">${statsHtml(n.stats)}</div>
      <p class="paper-lead" data-reveal>${escapeHtml(n.body)}</p>
      <blockquote class="paper-quote" data-reveal>
        <p>${escapeHtml(n.quote)}</p>
        <cite>${escapeHtml(n.quoteBy)}</cite>
      </blockquote>
      <ul class="paper-bullets">
        ${(n.bullets || []).map((b) => `<li data-reveal>${escapeHtml(b)}</li>`).join("")}
      </ul>
      <p class="paper-warning" data-reveal>${escapeHtml(n.warning)}</p>
      <button type="button" class="btn-primary btn-accent" id="btn-news" data-reveal>
        ${escapeHtml(n.cta)}
      </button>`;
  }

  /** layout: paper | tv | magazine */
  function renderNewsShell() {
    const n = currentNews();
    if (!n) {
      advanceFromNews();
      return;
    }
    const c = t();
    const dateLong = todayLong();
    const dateShort = todayShort();
    const region = c.newsRegion || "";
    const layout = n.layout || "paper";

    if (layout === "tv") {
      el.screen.innerHTML = `
        <article class="tv-card" id="news-root">
          <div class="tv-bezel">
            <div class="tv-screen">
              <img src="${img(n.image)}" alt="" width="900" height="500" />
              <div class="tv-scan" aria-hidden="true"></div>
              <div class="tv-topbar">
                <span class="tv-channel">${escapeHtml(n.paper)}</span>
                <span class="tv-clock" id="paper-date">${escapeHtml(dateShort)}</span>
              </div>
              <div class="tv-lower">
                <span class="tv-badge">${escapeHtml(n.stamp)}</span>
                <span class="tv-cat">${escapeHtml(n.category)}</span>
              </div>
              <div class="tv-ticker-line">
                <span>${escapeHtml(region)} · ${escapeHtml(dateLong)}</span>
              </div>
            </div>
          </div>
          <div class="tv-panel">
            ${newsSharedBody(n)}
          </div>
        </article>`;
    } else if (layout === "magazine") {
      el.screen.innerHTML = `
        <article class="mag-card" id="news-root">
          <div class="mag-cover">
            <img src="${img(n.image)}" alt="" width="900" height="500" />
            <div class="mag-cover-meta">
              <span class="mag-issue" id="paper-date">${escapeHtml(dateShort)}</span>
              <span class="mag-brand">${escapeHtml(n.paper)}</span>
            </div>
            <span class="mag-sticker">${escapeHtml(n.stamp)}</span>
          </div>
          <div class="mag-body">
            <p class="mag-kicker">${escapeHtml(n.category)} · ${escapeHtml(region)}</p>
            ${newsSharedBody(n)}
          </div>
        </article>`;
    } else {
      el.screen.innerHTML = `
        <article class="paper" id="news-root">
          <header class="paper-head">
            <div class="paper-head-row">
              <span class="paper-name">${escapeHtml(n.paper)}</span>
              <span class="paper-date-badge" id="paper-date">${escapeHtml(dateShort)}</span>
            </div>
            <p class="paper-date-long">${escapeHtml(dateLong)}</p>
            <div class="paper-rule" aria-hidden="true"></div>
            <div class="paper-kicker">
              <span class="paper-cat">${escapeHtml(n.category)}</span>
              <span class="paper-dateline">${escapeHtml(region)} · ${escapeHtml(dateShort)}</span>
            </div>
          </header>
          <div class="paper-media">
            <img src="${img(n.image)}" alt="" width="900" height="500" />
          </div>
          <div class="paper-body">
            ${newsSharedBody(n)}
          </div>
        </article>`;
    }

    document.getElementById("btn-news").addEventListener("click", (e) => {
      M.ripple(e.currentTarget, e);
      advanceFromNews();
    });
  }

  /** Troca de idioma no meio da notícia: preenche tudo sem re-animar */
  function fillNewsStatic() {
    const n = currentNews();
    const root = document.getElementById("news-root");
    if (!n || !root) return;
    const headline = document.getElementById("paper-headline");
    if (headline) headline.textContent = n.title;
    root.querySelectorAll("[data-count]").forEach((node) => {
      const val = node.dataset.count;
      const suffix = node.dataset.suffix || "";
      node.textContent = `${val}${suffix}`;
    });
  }

  async function runNewsEffects() {
    const n = currentNews();
    const root = document.getElementById("news-root");
    if (!n || !root) return;

    M.pageFlash(root);
    M.impactBar(root);
    M.screenShake(el.screen);
    M.stamp(root, n.stamp);

    const badge = document.getElementById("paper-date");
    if (badge && badge.animate && !M.reduced()) {
      badge.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
        { duration: 700, iterations: 2 }
      );
    }

    await M.typewriter(document.getElementById("paper-headline"), n.title, 12);

    root.querySelectorAll("[data-count]").forEach((node, i) => {
      window.setTimeout(() => {
        M.countUp(node, Number(node.dataset.count), {
          suffix: node.dataset.suffix || "",
          duration: 1100,
        });
      }, i * 160);
    });

    M.stagger(el.screen, "[data-reveal]", 100);
    M.pulseCta(document.getElementById("btn-news"));
  }

  function advanceFromNews() {
    const n = currentNews();
    const after = n?.afterQuestion || state.qIndex + 1;
    state.pendingNewsId = null;
    if (after >= TOTAL_Q) {
      goAnalyze();
      return;
    }
    go("question", () => {
      state.qIndex = after;
    });
  }

  /** Nível de atención 0–100 (siempre alto / urgencia) a partir del score */
  function attentionLevel() {
    const base = 88 + Math.min(11, Math.floor((state.score || 24) / 4));
    return Math.min(99, Math.max(86, base));
  }

  function goAnalyze() {
    go("analyze").then(async () => {
      await runLoadingTransition(3000);
      await go("result");
    });
  }

  /** Pantalla simple de carga ~3s → resultado */
  function renderAnalyze() {
    const c = t();
    el.screen.innerHTML = `
      <div class="loading-screen" id="loading-root" role="status" aria-live="polite">
        <div class="loading-spinner" aria-hidden="true"></div>
        <p class="loading-kicker" id="loading-status">${escapeHtml(c.analyzeLoading)}</p>
        <h2>${escapeHtml(c.analyzeTitle)}</h2>
        <p class="loading-sub">${escapeHtml(c.analyzeText)}</p>
        <div class="loading-bar-wrap">
          <div class="loading-bar-track">
            <div class="loading-bar-fill" id="loading-bar-fill"></div>
          </div>
          <span class="loading-bar-pct" id="loading-bar-pct">0%</span>
        </div>
      </div>
    `;
  }

  async function runLoadingTransition(ms = 3000) {
    const c = t();
    const reduced = M.reduced();
    const duration = reduced ? 400 : ms;
    const fill = document.getElementById("loading-bar-fill");
    const pct = document.getElementById("loading-bar-pct");
    const status = document.getElementById("loading-status");
    const phrases = [
      c.analyzeLoading,
      c.analyzeTitle,
      (c.analyzeSteps && c.analyzeSteps[1]) || c.analyzeText,
      c.analyzeDone,
    ].filter(Boolean);

    const start = performance.now();
    let phraseIdx = 0;

    await new Promise((resolve) => {
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 2);
        const v = Math.round(eased * 100);
        if (fill) fill.style.width = `${v}%`;
        if (pct) pct.textContent = `${v}%`;

        const nextPhrase = Math.min(phrases.length - 1, Math.floor(p * phrases.length));
        if (status && nextPhrase !== phraseIdx) {
          phraseIdx = nextPhrase;
          status.textContent = phrases[phraseIdx];
        }

        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });

    if (status) status.textContent = c.analyzeDone;
    await M.wait(reduced ? 50 : 200);
  }

  function renderResult() {
    const c = t();
    const level = attentionLevel();
    const labels = c.meterLabels || [];
    const vals = [
      Math.min(99, level - 2),
      Math.min(99, level - 5),
      Math.min(99, level + 1),
    ];
    const tagList = tagsForCurrentLang().slice(0, 5);
    while (tagList.length < 3) {
      tagList.push(c.resultTagsDefault[tagList.length] || c.resultTagsDefault[0]);
    }
    el.screen.innerHTML = `
      <article class="result-card" id="result-root">
        <div class="result-hero">
          <span class="badge-critical" data-reveal>⚡ ${escapeHtml(c.resultBadge)}</span>

          <div class="result-level" data-reveal>
            <div class="result-level-ring" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle class="result-level-bg" cx="50" cy="50" r="42" />
                <circle class="result-level-fg" id="result-level-fg" cx="50" cy="50" r="42" />
              </svg>
              <div class="result-level-core">
                <span id="result-level-pct">0</span><small>%</small>
              </div>
            </div>
            <p class="result-level-label">${escapeHtml(c.analyzeRisk)}</p>
          </div>

          <h2 data-reveal>${escapeHtml(c.resultTitle)}</h2>
          <p data-reveal>${escapeHtml(c.resultLead)}</p>
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
          <div class="tags" data-reveal>
            ${tagList.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <ul class="result-list">
            ${c.resultPoints.map((p) => `<li data-reveal>${escapeHtml(p)}</li>`).join("")}
          </ul>
          <a class="btn-primary btn-accent" id="btn-hotmart" href="${HOTMART}" target="_blank" rel="noopener noreferrer" data-reveal>
            ${escapeHtml(c.ctaSolution)}
          </a>
          <p class="price-note" data-reveal>${escapeHtml(c.priceNote)}</p>
          <p class="footer-note" data-reveal>${escapeHtml(c.footerNote)}</p>
        </div>
      </article>
    `;

    M.stagger(el.screen, "[data-reveal]", 70);
    M.pulseCta(document.getElementById("btn-hotmart"));

    // Círculo de % animado
    const fg = document.getElementById("result-level-fg");
    const circ = 2 * Math.PI * 42;
    if (fg) {
      fg.style.strokeDasharray = String(circ);
      fg.style.strokeDashoffset = String(circ);
      requestAnimationFrame(() => {
        fg.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
        fg.style.strokeDashoffset = String(circ * (1 - level / 100));
      });
    }
    M.countUp(document.getElementById("result-level-pct"), level, { duration: 1200 });

    // Barras de nivel
    el.screen.querySelectorAll("[data-meter]").forEach((m, i) => {
      const target = Number(m.dataset.meter) || 90;
      window.setTimeout(() => {
        m.style.width = `${target}%`;
        const valEl = el.screen.querySelectorAll("[data-mval]")[i];
        if (valEl) M.countUp(valEl, target, { duration: 900, suffix: "%" });
      }, 200 + i * 160);
    });
  }

  el.langBtns.forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });

  applyDocumentLang();
  paint({ enterMode: "up" });
})();
