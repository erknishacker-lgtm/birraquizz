/**
 * Painel /dadosquizz — funil e drop-off (privado por senha).
 */
(function () {
  const CFG = window.ANALYTICS_CONFIG || {};
  const NS = CFG.namespace || "birraquizz";
  const BASE = (CFG.counterApiBase || "https://api.counterapi.dev/v1").replace(/\/$/, "");
  const PASS = CFG.dashboardPassword || "birra2026";
  const AUTH_KEY = "dadosquizz_auth";
  const FUNNEL = CFG.funnelKeys || [];

  const el = {
    gate: document.getElementById("auth-gate"),
    dash: document.getElementById("dashboard"),
    form: document.getElementById("auth-form"),
    pass: document.getElementById("auth-pass"),
    err: document.getElementById("auth-err"),
    table: document.getElementById("funnel-table"),
    summary: document.getElementById("summary-cards"),
    status: document.getElementById("load-status"),
    btnRefresh: document.getElementById("btn-refresh"),
    btnLogout: document.getElementById("btn-logout"),
    worst: document.getElementById("worst-drop"),
  };

  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  }

  function setAuthed(v) {
    if (v) sessionStorage.setItem(AUTH_KEY, "1");
    else sessionStorage.removeItem(AUTH_KEY);
  }

  function showDash(show) {
    if (el.gate) el.gate.hidden = show;
    if (el.dash) el.dash.hidden = !show;
  }

  async function fetchCount(key) {
    const url = `${BASE}/${encodeURIComponent(NS)}/${encodeURIComponent(key)}/`;
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return 0;
      const j = await r.json();
      return Number(j.count || j.value || 0) || 0;
    } catch {
      // fallback local
      try {
        const local = JSON.parse(localStorage.getItem("birra_analytics_local") || "{}");
        return Number(local[key] || 0) || 0;
      } catch {
        return 0;
      }
    }
  }

  async function loadAll() {
    if (el.status) el.status.textContent = "Carregando contadores…";
    const counts = {};
    // paralelo em lotes para não estourar
    const keys = FUNNEL.map((f) => f.key);
    const batch = 6;
    for (let i = 0; i < keys.length; i += batch) {
      const slice = keys.slice(i, i + batch);
      const vals = await Promise.all(slice.map((k) => fetchCount(k)));
      slice.forEach((k, idx) => {
        counts[k] = vals[idx];
      });
    }
    // mescla local se remoto = 0 e local > 0
    try {
      const local = JSON.parse(localStorage.getItem("birra_analytics_local") || "{}");
      keys.forEach((k) => {
        if (!counts[k] && local[k]) counts[k] = Number(local[k]) || 0;
      });
    } catch (_) {}

    renderSummary(counts);
    renderTable(counts);
    renderWorst(counts);
    if (el.status) {
      const t = new Date().toLocaleString("pt-BR");
      el.status.textContent = `Atualizado: ${t} · namespace: ${NS}`;
    }
  }

  function pct(n, d) {
    if (!d || d <= 0) return 0;
    return Math.round((n / d) * 1000) / 10;
  }

  function renderSummary(counts) {
    if (!el.summary) return;
    const visit = counts.visit || 0;
    const start = counts.start || 0;
    const result = counts.result || 0;
    const cta = counts.cta_checkout || 0;
    const cards = [
      { label: "Visitas ao quiz", value: visit },
      { label: "Começaram o quiz", value: start, sub: visit ? `${pct(start, visit)}% das visitas` : "" },
      { label: "Chegaram no resultado", value: result, sub: start ? `${pct(result, start)}% de quem começou` : "" },
      { label: "Clicaram no checkout", value: cta, sub: result ? `${pct(cta, result)}% do resultado` : start ? `${pct(cta, start)}% de quem começou` : "" },
    ];
    el.summary.innerHTML = cards
      .map(
        (c) => `
      <div class="stat-card">
        <p class="stat-label">${escapeHtml(c.label)}</p>
        <p class="stat-value">${c.value}</p>
        ${c.sub ? `<p class="stat-sub">${escapeHtml(c.sub)}</p>` : ""}
      </div>`
      )
      .join("");
  }

  function renderTable(counts) {
    if (!el.table) return;
    const base = counts.start || counts.visit || 0;
    const visit = counts.visit || 0;

    let rows = "";
    let prev = null;
    FUNNEL.forEach((step, i) => {
      const n = counts[step.key] || 0;
      const reachOfStart = pct(n, base || visit || 1);
      const reachOfVisit = pct(n, visit || 1);
      let drop = "—";
      let dropCls = "";
      if (prev !== null && prev > 0) {
        const lost = Math.max(0, prev - n);
        const d = pct(lost, prev);
        drop = `${d}% (−${lost})`;
        if (d >= 25) dropCls = "is-bad";
        else if (d >= 12) dropCls = "is-warn";
      }
      const barW = Math.min(100, reachOfStart || reachOfVisit);
      rows += `
        <tr>
          <td class="col-step"><span class="step-idx">${i + 1}</span> ${escapeHtml(step.label)}</td>
          <td class="col-num">${n}</td>
          <td class="col-pct">
            <div class="mini-bar"><i style="width:${barW}%"></i></div>
            <span>${visit ? reachOfVisit : reachOfStart}%</span>
          </td>
          <td class="col-drop ${dropCls}">${drop}</td>
        </tr>`;
      prev = n;
    });

    el.table.innerHTML = `
      <thead>
        <tr>
          <th>Etapa</th>
          <th>Pessoas</th>
          <th>% quem chegou (vs visitas)</th>
          <th>Queda vs etapa anterior</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>`;
  }

  function renderWorst(counts) {
    if (!el.worst) return;
    let worst = null;
    let prev = null;
    let prevLabel = "";
    FUNNEL.forEach((step) => {
      const n = counts[step.key] || 0;
      if (prev !== null && prev > 0) {
        const lost = Math.max(0, prev - n);
        const d = lost / prev;
        if (!worst || d > worst.d) {
          worst = { from: prevLabel, to: step.label, d, lost };
        }
      }
      prevLabel = step.label;
      prev = n;
    });

    if (!worst || worst.d <= 0) {
      el.worst.innerHTML = `<p class="funnel-muted">Ainda não há queda relevante (poucos dados).</p>`;
      return;
    }
    const p = Math.round(worst.d * 1000) / 10;
    el.worst.innerHTML = `
      <div class="funnel-box is-warn">
        <h3>Maior travamento</h3>
        <p>Entre <strong>${escapeHtml(worst.from)}</strong> e <strong>${escapeHtml(worst.to)}</strong>:
        <strong>${p}%</strong> saíram (−${worst.lost} pessoas). Foque em melhorar essa etapa.</p>
      </div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (el.form) {
    el.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (el.pass && el.pass.value) || "";
      if (v === PASS) {
        setAuthed(true);
        if (el.err) el.err.hidden = true;
        showDash(true);
        loadAll();
      } else {
        if (el.err) {
          el.err.hidden = false;
          el.err.textContent = "Senha incorreta.";
        }
      }
    });
  }

  if (el.btnRefresh) el.btnRefresh.addEventListener("click", () => loadAll());
  if (el.btnLogout) {
    el.btnLogout.addEventListener("click", () => {
      setAuthed(false);
      showDash(false);
      if (el.pass) el.pass.value = "";
    });
  }

  if (isAuthed()) {
    showDash(true);
    loadAll();
  } else {
    showDash(false);
  }
})();
