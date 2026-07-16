/**
 * Funnel pages: lang switch + render by data-page
 * data-page: "obrigado" | "upsell" | "downsell"
 */
(() => {
  const I18N = window.FUNNEL_I18N;

  const page = document.body.dataset.page || "obrigado";
  const assetBase = document.body.dataset.assets || "../assets/images/";
  const HOTMART_SCRIPT = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";

  const state = { lang: detectLang(), hotmartScriptLoading: null };

  const el = {
    langGroup: document.querySelector(".lang"),
    langBtns: document.querySelectorAll("[data-lang]"),
    main: document.getElementById("funnel-main"),
    brand: document.querySelector(".brand-mini"),
    metaDesc: document.querySelector('meta[name="description"]'),
  };

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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function img(name) {
    return `${assetBase}${name}`;
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    state.lang = lang;
    localStorage.setItem("quiz-lang", lang);
    applyChrome();
    render();
  }

  function applyChrome() {
    const c = t();
    document.documentElement.lang = localeTag();
    const pageCopy = c[page];
    if (pageCopy?.metaTitle) document.title = pageCopy.metaTitle;
    if (el.metaDesc && pageCopy?.metaDesc) el.metaDesc.setAttribute("content", pageCopy.metaDesc);
    if (el.langGroup && c.langAria) el.langGroup.setAttribute("aria-label", c.langAria);
    if (el.brand) el.brand.textContent = c.brand;
    el.langBtns.forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function renderObrigado(c) {
    const p = c.obrigado;
    return `
      <article class="funnel-card">
        <div class="funnel-body" style="align-items:center;text-align:center">
          <div class="thanks-check" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <p class="funnel-kicker">${escapeHtml(p.badge)}</p>
          <h1>${escapeHtml(p.title)}</h1>
          <p class="funnel-lead">${escapeHtml(p.lead)}</p>
          <div class="funnel-pills">
            ${p.pills.map((x) => `<span>${escapeHtml(x)}</span>`).join("")}
          </div>
        </div>
      </article>

      <article class="funnel-card">
        <div class="funnel-body">
          <h2 style="margin:0;font-family:var(--font);font-size:1.05rem;font-weight:800;color:var(--primary-deep)">${escapeHtml(p.nextTitle)}</h2>
          <div class="funnel-steps">
            ${p.steps
              .map(
                (s, i) => `
              <div class="funnel-step">
                <span class="funnel-step-num">${i + 1}</span>
                <div>
                  <h3>${escapeHtml(s.t)}</h3>
                  <p>${escapeHtml(s.d)}</p>
                </div>
              </div>`
              )
              .join("")}
          </div>
          <div class="funnel-box is-soft">
            <h3>${escapeHtml(p.boxTitle)}</h3>
            <p>${escapeHtml(p.boxText)}</p>
          </div>
          <div class="btn-block">
            <a class="btn-primary" href="mailto:">${escapeHtml(p.ctaMail)}</a>
          </div>
          <p class="funnel-footer">${escapeHtml(p.footer)}</p>
          <p class="funnel-footer">${escapeHtml(c.common.guarantee)}</p>
        </div>
      </article>`;
  }

  function renderUpsell(c) {
    const p = c.upsell;
    return `
      <article class="funnel-card">
        <div class="funnel-media">
          <img src="${img("scene-q12.jpg")}" alt="" width="800" height="500" />
          <span class="funnel-badge">${escapeHtml(p.badge)}</span>
        </div>
        <div class="funnel-body">
          <p class="funnel-kicker">${escapeHtml(p.kicker)}</p>
          <h1>${escapeHtml(p.title)}</h1>
          <p class="funnel-lead">${escapeHtml(p.lead)}</p>
          <div class="funnel-box">
            <h3>${escapeHtml(p.promiseTitle)}</h3>
            <p>${escapeHtml(p.promise)}</p>
          </div>
        </div>
      </article>

      <article class="funnel-card">
        <div class="funnel-body">
          <h2 style="margin:0;font-family:var(--font);font-size:1.05rem;font-weight:800;color:var(--primary-deep)">${escapeHtml(p.contentsTitle)}</h2>
          <ul class="funnel-list is-check">
            ${p.contents.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}
          </ul>
          <div class="funnel-box">
            <h3>${escapeHtml(p.exclusiveTitle)}</h3>
            <p>${escapeHtml(p.exclusive)}</p>
          </div>
          <h2 style="margin:4px 0 0;font-family:var(--font);font-size:1.05rem;font-weight:800;color:var(--primary-deep)">${escapeHtml(p.forWhoTitle)}</h2>
          <ul class="funnel-list">
            ${p.forWho.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}
          </ul>
          <p class="funnel-price">
            <span class="hint">${escapeHtml(p.priceHint)}</span>
            <span class="hint">${escapeHtml(c.common.secure)}</span>
          </p>
          <div class="btn-block">
            <!-- HOTMART - Sales Funnel Widget (upsell) -->
            <div id="hotmart-sales-funnel" class="hotmart-sales-funnel" aria-label="${escapeHtml(p.cta)}"></div>
            <a class="btn-decline" href="../obrigado/">${escapeHtml(p.decline)}</a>
          </div>
          <p class="funnel-footer">${escapeHtml(p.footer)}</p>
          <p class="funnel-footer">${escapeHtml(c.common.guarantee)}</p>
        </div>
      </article>`;
  }

  function renderDownsell(c) {
    const p = c.downsell;
    return `
      <article class="funnel-card">
        <div class="funnel-media">
          <img src="${img("scene-q1.jpg")}" alt="" width="800" height="500" />
          <span class="funnel-badge is-alert">${escapeHtml(p.badge)}</span>
        </div>
        <div class="funnel-body">
          <p class="funnel-kicker">${escapeHtml(p.kicker)}</p>
          <h1>${escapeHtml(p.title)}</h1>
          <p class="funnel-lead">${escapeHtml(p.lead)}</p>
          <div class="funnel-box is-soft">
            <h3>${escapeHtml(p.whenTitle)}</h3>
            <p>${escapeHtml(p.when)}</p>
          </div>
          <div class="funnel-box">
            <h3>${escapeHtml(p.gainTitle)}</h3>
            <p>${escapeHtml(p.gain)}</p>
          </div>
        </div>
      </article>

      <article class="funnel-card">
        <div class="funnel-body">
          <h2 style="margin:0;font-family:var(--font);font-size:1.05rem;font-weight:800;color:var(--primary-deep)">${escapeHtml(p.structureTitle)}</h2>
          <ul class="funnel-list is-num">
            ${p.structure.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}
          </ul>
          <div class="funnel-box is-soft">
            <h3>${escapeHtml(p.deliveryTitle)}</h3>
            <p>${escapeHtml(p.delivery)}</p>
          </div>
          <p class="funnel-price">
            <span class="hint">${escapeHtml(p.priceHint)}</span>
            <span class="hint">${escapeHtml(c.common.secure)}</span>
          </p>
          <div class="btn-block">
            <!-- HOTMART - Sales Funnel Widget (downsell) -->
            <div id="hotmart-sales-funnel" class="hotmart-sales-funnel" aria-label="${escapeHtml(p.cta)}"></div>
            <a class="btn-decline" href="../">${escapeHtml(p.decline)}</a>
          </div>
          <p class="funnel-footer">${escapeHtml(p.footer)}</p>
          <p class="funnel-footer">${escapeHtml(c.common.guarantee)}</p>
        </div>
      </article>`;
  }

  function loadHotmartScript() {
    if (window.checkoutElements) return Promise.resolve();
    if (state.hotmartScriptLoading) return state.hotmartScriptLoading;
    state.hotmartScriptLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="hotmart-checkout-elements"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        if (window.checkoutElements) resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = HOTMART_SCRIPT;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Hotmart script failed"));
      document.body.appendChild(s);
    });
    return state.hotmartScriptLoading;
  }

  /** Monta o botão/widget do funil Hotmart (upsell ou downsell, conforme a URL no painel Hotmart) */
  function mountHotmartSalesFunnel() {
    if (page !== "upsell" && page !== "downsell") return;
    const target = document.getElementById("hotmart-sales-funnel");
    if (!target) return;

    loadHotmartScript()
      .then(() => {
        if (!window.checkoutElements || typeof window.checkoutElements.init !== "function") {
          console.warn("Hotmart checkoutElements não disponível");
          return;
        }
        // Remonta no container limpo (troca de idioma recria o HTML)
        target.innerHTML = "";
        try {
          window.checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel");
        } catch (err) {
          console.warn("Hotmart salesFunnel mount:", err);
        }
      })
      .catch((err) => console.warn(err));
  }

  function render() {
    const c = t();
    if (!el.main) return;
    if (page === "upsell") el.main.innerHTML = renderUpsell(c);
    else if (page === "downsell") el.main.innerHTML = renderDownsell(c);
    else el.main.innerHTML = renderObrigado(c);
    mountHotmartSalesFunnel();
  }

  el.langBtns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  applyChrome();
  render();
})();
