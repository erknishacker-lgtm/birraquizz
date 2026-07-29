/* ==========================================================
   Quiz Sono — motor do funil (clone inlead)
   Lê FUNNEL de funnel-data.js e renderiza etapa por etapa.
   ========================================================== */

(function () {
  'use strict';

  const steps = FUNNEL.steps;
  const root = document.getElementById('stepRoot');
  const backBtn = document.getElementById('backBtn');
  const progressFill = document.getElementById('progressFill');

  let current = 0;
  const navHistory = [];
  const selections = {}; // stepId -> Set de option ids

  let loadingRAF = null;      // animação do loading ativo
  let countdownEnd = null;    // timestamp final do timer (global — os dois timers da página de oferta mostram o mesmo tempo)
  let countdownInterval = null;

  /* ---------------- pixel (placeholder) ---------------- */
  if (CONFIG.fbPixelId) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CONFIG.fbPixelId);
    fbq('track', 'PageView');
  }
  function track(event) {
    if (CONFIG.fbPixelId && window.fbq) fbq('track', event);
  }

  /* ---------------- helpers ---------------- */
  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function isUrl(src) {
    return typeof src === 'string' && (src.startsWith('http') || src.startsWith('./') || src.startsWith('/'));
  }

  function stepHasButton(step) {
    return step.layers.some((l) => l.type === 'button');
  }

  function getSelection(step) {
    if (!selections[step.id]) selections[step.id] = new Set();
    return selections[step.id];
  }

  /* ---------------- navegação ---------------- */
  function goNext() {
    if (current < steps.length - 1) {
      navHistory.push(current);
      renderStep(current + 1);
    }
  }

  function goBack() {
    if (navHistory.length) renderStep(navHistory.pop());
  }

  function redirectToCheckout() {
    track('InitiateCheckout');
    if (window.FunnelTracker) window.FunnelTracker.trackCheckoutClick(steps[current]);
    window.open(CONFIG.checkoutUrl, '_blank');
  }

  /* ---------------- renderers por tipo de camada ---------------- */

  function renderText(layer) {
    return el('div', 'rich-text', layer.content.text || '');
  }

  function renderImage(layer) {
    const img = el('img', 'layer-img');
    img.src = layer.content.image.src;
    img.alt = 'Imagem';
    img.loading = 'lazy';
    return img;
  }

  function renderAlert(layer) {
    const style = (layer.design && layer.design.style) || 'warning';
    return el('div', `alert alert-${style === 'danger' ? 'danger' : 'warning'} rich-text`, layer.content.text || '');
  }

  function renderOptions(layer, step) {
    const c = layer.content;
    const multi = c.required === false;
    const grid = el('div', `options-grid ${c.cols || 'grid-cols-1'}`);
    const sel = getSelection(step);

    c.options.forEach((opt) => {
      const card = el('button', 'option-card');
      card.type = 'button';
      if (sel.has(opt.id)) card.classList.add('selected');

      const src = opt.image && opt.image.src;
      if (src && isUrl(src)) {
        const img = el('img', 'opt-img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        card.appendChild(img);
      }

      const body = el('div', 'opt-body');
      if (src && !isUrl(src)) body.appendChild(el('span', 'opt-emoji', src));

      const radio = el('span', 'opt-radio');
      radio.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
      body.appendChild(radio);

      body.appendChild(el('div', 'opt-label', opt.label || ''));
      card.appendChild(body);

      card.addEventListener('click', () => {
        if (multi) {
          sel.has(opt.id) ? sel.delete(opt.id) : sel.add(opt.id);
          card.classList.toggle('selected');
          if (window.FunnelTracker) window.FunnelTracker.trackAnswer(step, opt, sel.has(opt.id));
          syncStepButtons(step);
        } else {
          sel.clear();
          sel.add(opt.id);
          grid.querySelectorAll('.option-card').forEach((n) => n.classList.remove('selected'));
          card.classList.add('selected');
          track('QuizAnswer');
          if (window.FunnelTracker) window.FunnelTracker.trackAnswer(step, opt, true);
          if (stepHasButton(step)) {
            syncStepButtons(step);
          } else {
            setTimeout(goNext, 350);
          }
        }
      });

      grid.appendChild(card);
    });

    return grid;
  }

  function renderButton(layer, step) {
    const c = layer.content;
    const isRedirect = c.type === 'redirect';
    const btn = el('button', isRedirect ? 'btn-primary btn-cta' : 'btn-primary', c.label || 'Continuar');
    btn.type = 'button';
    btn.dataset.layerId = layer.content.id;

    btn.addEventListener('click', () => {
      if (!isRedirect && window.FunnelTracker) window.FunnelTracker.trackButtonClick(step, c.label);
      if (isRedirect) redirectToCheckout();
      else goNext();
    });

    // guarda referência para habilitar/desabilitar conforme seleção
    if (!step._buttons) step._buttons = [];
    step._buttons.push(btn);
    return btn;
  }

  // habilita o botão só quando há seleção em etapa com opções obrigatórias
  function syncStepButtons(step) {
    const hasRequiredOptions = step.layers.some((l) => l.type === 'options' && l.content.required !== false);
    const sel = getSelection(step);
    const enabled = !hasRequiredOptions || sel.size > 0;
    (step._buttons || []).forEach((btn) => {
      // botões de redirect (oferta) nunca ficam desabilitados
      if (!btn.classList.contains('btn-cta')) btn.disabled = !enabled;
    });
  }

  function renderLoading(layer, step, onDone) {
    const c = layer.content;
    const wrap = el('div', 'loading-wrap');
    const texts = step.layers.filter((l) => l.type === 'text');
    const titleHtml = texts.length ? texts[0].content.text : (c.title || 'Carregando...');
    // título como texto puro (sem tags do quill)
    const tmp = el('div', '', titleHtml);
    const titleText = (tmp.textContent || '').trim() || 'Carregando...';

    if (c.show_title !== false) wrap.appendChild(el('div', 'loading-title', titleText));

    const row = el('div', 'loading-bar-row');
    const trackEl = el('div', 'loading-track');
    const fill = el('div', 'loading-fill');
    trackEl.appendChild(fill);
    row.appendChild(trackEl);
    if (c.show_percent !== false) row.appendChild(el('div', 'loading-pct', '0%'));
    wrap.appendChild(row);

    wrap._start = () => {
      const duration = (c.seconds || 5) * 1000;
      const start = performance.now();
      const pctEl = wrap.querySelector('.loading-pct');
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        fill.style.width = `${p * 100}%`;
        if (pctEl) pctEl.textContent = `${Math.round(p * 100)}%`;
        if (p < 1) loadingRAF = requestAnimationFrame(tick);
        else onDone();
      }
      loadingRAF = requestAnimationFrame(tick);
    };

    return wrap;
  }

  function renderChart(layer) {
    const datas = (layer.content.datas || []).filter((d) => d.legend != null);
    const W = 360, H = 210, PAD_X = 18, PAD_TOP = 34, PAD_BOT = 26;
    const plotW = W - PAD_X * 2, plotH = H - PAD_TOP - PAD_BOT;
    const maxVal = 100;

    // x: percentual do legend ("25%") ou posição uniforme quando texto
    const pts = datas.map((d, i) => {
      const m = /(\d+(?:\.\d+)?)\s*%/.exec(d.legend || '');
      const xp = m ? parseFloat(m[1]) : (i / (datas.length - 1)) * 100;
      const val = parseFloat(d.value) || 0;
      return {
        x: PAD_X + (xp / 100) * plotW,
        y: PAD_TOP + plotH - (val / maxVal) * plotH,
        d,
      };
    });

    // curva suave (catmull-rom -> bezier)
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    const baseY = PAD_TOP + plotH;
    const area = `${path} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`;

    const gridLines = [0.25, 0.5, 0.75].map((f) => {
      const y = PAD_TOP + plotH * f;
      return `<line x1="${PAD_X}" y1="${y}" x2="${W - PAD_X}" y2="${y}" stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1"/>`;
    }).join('');

    const labels = pts.map((p) =>
      `<text x="${p.x}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#9ca3af">${p.d.legend}</text>`
    ).join('');

    const pills = pts.filter((p) => p.d.tooltip).map((p) => {
      const featured = !!p.d.featured;
      const textW = p.d.tooltip.length * 6.5 + 16;
      const bx = Math.min(Math.max(p.x - textW / 2, 2), W - textW - 2);
      const by = Math.max(p.y - 34, 2);
      const bg = featured ? '#2563eb' : '#ffffff';
      const fg = featured ? '#ffffff' : '#374151';
      const stroke = featured ? 'none' : '#d1d5db';
      return `<g>
        <rect x="${bx}" y="${by}" width="${textW}" height="22" rx="11" fill="${bg}" stroke="${stroke}"/>
        <text x="${bx + textW / 2}" y="${by + 15}" text-anchor="middle" font-size="11" font-weight="600" fill="${fg}">${p.d.tooltip}</text>
      </g>`;
    }).join('');

    const svg = `
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.15"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${area}" fill="url(#chartGrad)"/>
        <path d="${path}" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
        ${pills}
        ${labels}
      </svg>`;

    return el('div', 'chart-wrap', svg);
  }

  function renderQuotes(layer) {
    const wrap = el('div', 'quotes-wrap', '');
    (layer.content.quotes || []).forEach((q) => {
      const card = el('div', 'quote-card');
      card.appendChild(el('div', 'quote-stars', '★'.repeat(q.rate || 5)));
      card.appendChild(el('div', 'quote-name', q.name || ''));
      card.appendChild(el('div', 'quote-text', q.text || ''));
      wrap.appendChild(card);
    });
    return wrap;
  }

  function renderArguments(layer) {
    const c = layer.content;
    const grid = el('div', `arguments-grid ${c.cols || 'grid-cols-2'}`);
    (c.arguments || []).forEach((arg) => {
      grid.appendChild(el('div', 'argument-card rich-text', arg.text || ''));
    });
    return grid;
  }

  function renderPrice(layer) {
    const c = layer.content;
    const card = el('div', 'price-card');
    if (c.featured) card.appendChild(el('div', 'price-featured', c.featured));
    if (c.title) card.appendChild(el('div', 'price-title rich-text', c.title));
    if (c.before) card.appendChild(el('div', 'price-before', c.before));
    const m = /^(R\$)\s*(.*)$/.exec(c.value || '');
    card.appendChild(el('div', 'price-value',
      m ? `<span class="price-currency">${m[1]}</span> ${m[2]}` : (c.value || '')));
    if (c.after) card.appendChild(el('div', 'price-after', c.after));
    return card;
  }

  function renderTimer(layer) {
    const seconds = parseInt(layer.content.time, 10) || 120;
    if (!countdownEnd) countdownEnd = Date.now() + seconds * 1000;

    const wrap = el('div', 'timer-wrap');
    wrap.innerHTML = `
      <div class="timer-box"><div class="timer-num" data-tmr="min">00</div><div class="timer-label">min</div></div>
      <div class="timer-sep"> : </div>
      <div class="timer-box"><div class="timer-num" data-tmr="seg">00</div><div class="timer-label">seg</div></div>`;

    if (!countdownInterval) {
      countdownInterval = setInterval(() => {
        const remain = Math.max(0, Math.round((countdownEnd - Date.now()) / 1000));
        const min = String(Math.floor(remain / 60)).padStart(2, '0');
        const seg = String(remain % 60).padStart(2, '0');
        document.querySelectorAll('[data-tmr="min"]').forEach((n) => (n.textContent = min));
        document.querySelectorAll('[data-tmr="seg"]').forEach((n) => (n.textContent = seg));
        if (remain <= 0) { clearInterval(countdownInterval); countdownInterval = null; }
      }, 500);
    }
    return wrap;
  }

  /* ---------------- render da etapa ---------------- */
  function renderStep(index) {
    // limpa animação de loading anterior
    if (loadingRAF) { cancelAnimationFrame(loadingRAF); loadingRAF = null; }

    current = index;
    const step = steps[index];
    step._buttons = [];
    if (window.FunnelTracker) window.FunnelTracker.enterStep(step, index, steps.length);

    root.innerHTML = '';
    root.classList.remove('anim');
    void root.offsetWidth; // reinicia a animação
    root.classList.add('anim');

    const loadingNodes = [];
    const isLoadingStep = step.layers.some((l) => l.type === 'loading');

    step.layers.forEach((layer) => {
      let node = null;
      switch (layer.type) {
        case 'text':
          // em etapa de loading, o primeiro texto vira o título do loading
          if (isLoadingStep && step.layers.indexOf(layer) === step.layers.findIndex((l) => l.type === 'text')) {
            const hasLoading = step.layers.find((l) => l.type === 'loading');
            if (hasLoading && hasLoading.content.show_title !== false) return;
          }
          node = renderText(layer); break;
        case 'image': node = renderImage(layer); break;
        case 'options': node = renderOptions(layer, step); break;
        case 'button': node = renderButton(layer, step); break;
        case 'alert': node = renderAlert(layer); break;
        case 'chart': node = renderChart(layer); break;
        case 'quotes': node = renderQuotes(layer); break;
        case 'arguments': node = renderArguments(layer); break;
        case 'price': node = renderPrice(layer); break;
        case 'timer': node = renderTimer(layer); break;
        case 'clear': {
          const h = (layer.content.clear || 'h-[2rem]').replace(/h-\[(.+)\]/, '$1');
          node = el('div', 'spacer');
          node.style.height = h;
          break;
        }
        case 'loading':
          node = renderLoading(layer, step, goNext);
          loadingNodes.push(node);
          break;
        default: break;
      }
      if (node) root.appendChild(node);
    });

    syncStepButtons(step);
    loadingNodes.forEach((n) => n._start && n._start());

    // header + progresso
    backBtn.hidden = navHistory.length === 0;
    progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ---------------- boot ---------------- */
  backBtn.addEventListener('click', goBack);
  document.getElementById('year').textContent = new Date().getFullYear();
  if (window.FunnelTracker) window.FunnelTracker.init(steps.length);
  renderStep(0);
})();
