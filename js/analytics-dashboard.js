/**
 * Painel /dadosquizz — funil, drop-off e leads (privado por senha).
 * Filtro por dia vale para funil + leads (dados do dia neste navegador).
 */
(function () {
  const CFG = window.ANALYTICS_CONFIG || {};
  const NS = CFG.namespace || "birraquizz";
  const BASE = (CFG.counterApiBase || "https://api.counterapi.dev/v1").replace(/\/$/, "");
  const PASS = CFG.dashboardPassword || "birra2026";
  const AUTH_KEY = "dadosquizz_auth";
  const FUNNEL = CFG.funnelKeys || [];
  const Store = window.LeadsStore;
  const LOCAL_KEY = (window.QuizAnalytics && window.QuizAnalytics.LOCAL_KEY) || "birra_analytics_local";
  const DAILY_KEY = (window.QuizAnalytics && window.QuizAnalytics.DAILY_KEY) || "birra_analytics_daily";

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
    leadsTable: document.getElementById("leads-table"),
    leadsMeta: document.getElementById("leads-meta"),
    btnLeadsRefresh: document.getElementById("btn-leads-refresh"),
    btnLeadsExport: document.getElementById("btn-leads-export"),
    btnLeadsExportJson: document.getElementById("btn-leads-export-json"),
    btnLeadsImport: document.getElementById("btn-leads-import"),
    btnLeadsClear: document.getElementById("btn-leads-clear"),
    leadsFile: document.getElementById("leads-file"),
    filterDate: document.getElementById("filter-date") || document.getElementById("leads-date"),
    btnAllDates: document.getElementById("btn-all-dates") || document.getElementById("btn-leads-all-dates"),
    filterHint: document.getElementById("filter-hint"),
  };

  /** YYYY-MM-DD local ou "" = todos */
  let dayFilter = "";

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

  function localDayKey(ts) {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatDayLabel(yyyyMmDd) {
    if (!yyyyMmDd) return "";
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    if (!y || !m || !d) return yyyyMmDd;
    try {
      return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return yyyyMmDd;
    }
  }

  function readDaily(day) {
    if (window.QuizAnalytics && typeof window.QuizAnalytics.getDaily === "function") {
      return window.QuizAnalytics.getDaily(day) || {};
    }
    try {
      const all = JSON.parse(localStorage.getItem(DAILY_KEY) || "{}");
      return (all && all[day]) || {};
    } catch {
      return {};
    }
  }

  function readLocalTotals() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  }

  /**
   * @returns {Promise<number|null>} null = falha de rede/API (não zerar o funil)
   */
  async function fetchCountRemote(key) {
    const url =
      (window.QuizAnalytics && typeof window.QuizAnalytics.remoteUrl === "function"
        ? window.QuizAnalytics.remoteUrl(key)
        : `${BASE}/${encodeURIComponent(NS)}/${encodeURIComponent(key)}/`);
    try {
      const r = await fetch(url, {
        cache: "no-store",
        mode: "cors",
        redirect: "follow",
        credentials: "omit",
      });
      if (r.status === 429) return null;
      if (!r.ok) return null;
      const j = await r.json();
      const n = Number(j.count != null ? j.count : j.value);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return null;
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function loadAll() {
    if (el.status) el.status.textContent = "Carregando contadores globais…";
    const keys = FUNNEL.map((f) => f.key);
    const counts = {};
    let remoteOk = 0;
    let remoteFail = 0;
    let leadsSync = { source: "—", ok: false };

    if (dayFilter) {
      // AVISO: filtro por dia ainda é local (CounterAPI não tem série diária)
      const daily = readDaily(dayFilter);
      keys.forEach((k) => {
        counts[k] = Number(daily[k]) || 0;
      });
    } else {
      // FONTE ÚNICA GLOBAL: CounterAPI (igual para todos os sócios)
      // NÃO misturar localStorage — isso gerava números diferentes por navegador
      const batch = 4;
      for (let i = 0; i < keys.length; i += batch) {
        const slice = keys.slice(i, i + batch);
        const vals = await Promise.all(slice.map((k) => fetchCountRemote(k)));
        slice.forEach((k, idx) => {
          const remote = vals[idx];
          if (remote == null) {
            remoteFail += 1;
            counts[k] = 0;
          } else {
            remoteOk += 1;
            counts[k] = remote;
          }
        });
        if (i + batch < keys.length) await sleep(200);
      }
      // Só se a API inteira falhar: fallback local com aviso forte
      if (remoteOk === 0 && remoteFail > 0) {
        const local = readLocalTotals();
        keys.forEach((k) => {
          counts[k] = Number(local[k]) || 0;
        });
      }
    }

    // Leads compartilhados (nuvem) — mesma lista para o time
    if (Store && typeof Store.sync === "function") {
      try {
        leadsSync = await Store.sync();
      } catch {
        leadsSync = { source: "local-only", ok: false };
      }
    }

    renderSummary(counts);
    renderTable(counts);
    renderWorst(counts);
    renderLeads();
    updateFilterChrome();

    if (el.status) {
      const t = new Date().toLocaleString("pt-BR");
      const leadsLabel =
        leadsSync.source === "shared"
          ? "leads: nuvem (iguais para o time)"
          : leadsSync.ok
            ? `leads: ${leadsSync.source}`
            : "leads: só local (falha ao sincronizar nuvem)";
      if (dayFilter) {
        el.status.textContent = `Atualizado: ${t} · funil do dia ${formatDayLabel(
          dayFilter
        )} ⚠️ só este navegador (não é total do site) · ${leadsLabel}`;
      } else if (remoteOk === 0 && remoteFail > 0) {
        el.status.textContent = `Atualizado: ${t} · ⚠️ CounterAPI falhou — funil LOCAL (pode diferir do sócio) · ${leadsLabel}`;
      } else if (remoteFail) {
        el.status.textContent = `Atualizado: ${t} · funil GLOBAL CounterAPI (${remoteFail} etapa(s) sem resposta=0) · ${leadsLabel} · ns:${NS}`;
      } else {
        el.status.textContent = `Atualizado: ${t} · funil GLOBAL CounterAPI (igual para todos) · ${leadsLabel} · ns:${NS}`;
      }
    }
  }

  function updateFilterChrome() {
    if (el.filterDate && el.filterDate.value !== dayFilter) {
      el.filterDate.value = dayFilter;
    }
    if (el.filterHint) {
      el.filterHint.textContent = dayFilter
        ? `Mostrando funil + leads do dia ${formatDayLabel(dayFilter)} (dados deste navegador).`
        : "Mostrando todos os dias (funil global + leads deste navegador).";
    }
  }

  function defaultWaMessage(lead) {
    const name = (lead.name || "").split(" ")[0] || "";
    if (lead.lang === "es") {
      return `Hola ${name}, vi tu diagnóstico en el test Berrinche Cero. ¿Conversamos sobre el protocolo de 7 minutos?`;
    }
    if (lead.lang === "en") {
      return `Hi ${name}, I saw your diagnosis from the Tantrum Zero quiz. Want to talk about the 7-minute protocol?`;
    }
    return `Olá ${name}, vi seu diagnóstico no teste Birra Zero. Podemos falar sobre o protocolo de 7 minutos?`;
  }

  function getFilteredLeads() {
    // Após sync(), readAll() reflete a lista compartilhada em nuvem
    const list = Store ? Store.readAll() : [];
    const sorted = list.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
    if (!dayFilter) return { all: sorted, filtered: sorted };
    return {
      all: sorted,
      filtered: sorted.filter((lead) => localDayKey(lead.ts) === dayFilter),
    };
  }

  function renderLeads() {
    if (!el.leadsTable) return;
    const { all, filtered } = getFilteredLeads();
    const emptyPrev = document.getElementById("leads-empty");
    if (emptyPrev) emptyPrev.remove();

    if (el.leadsMeta) {
      if (!all.length) {
        el.leadsMeta.textContent = "Nenhum lead ainda (lista compartilhada na nuvem)";
      } else if (dayFilter) {
        el.leadsMeta.textContent = `${filtered.length} de ${all.length} lead${
          all.length === 1 ? "" : "s"
        } · dia ${formatDayLabel(dayFilter)} · lista compartilhada`;
      } else {
        el.leadsMeta.textContent = `${all.length} lead${
          all.length === 1 ? "" : "s"
        } · lista compartilhada (igual para o time)`;
      }
    }

    if (!all.length) {
      el.leadsTable.innerHTML = "";
      el.leadsTable.insertAdjacentHTML(
        "afterend",
        `<p class="leads-empty" id="leads-empty">Quando alguém preencher nome, e-mail e WhatsApp no quiz, aparece aqui com data e botão para chamar no WhatsApp.</p>`
      );
      return;
    }

    if (!filtered.length) {
      el.leadsTable.innerHTML = "";
      el.leadsTable.insertAdjacentHTML(
        "afterend",
        `<p class="leads-empty" id="leads-empty">Nenhum lead neste dia (${escapeHtml(
          formatDayLabel(dayFilter)
        )}). Escolha outra data ou clique em “Todos os dias”.</p>`
      );
      return;
    }

    const rows = filtered
      .map((lead) => {
        const wa = Store.whatsappUrl(lead.phone, defaultWaMessage(lead));
        const date = Store.formatDate(lead.ts, "pt-BR");
        const tags = (lead.tags || [])
          .slice(0, 3)
          .map((t) => `<span class="tag-mini">${escapeHtml(t)}</span>`)
          .join("");
        const waBtn = wa
          ? `<a class="btn-wa" href="${escapeHtml(wa)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`
          : `<span class="btn-wa is-disabled">Sem nº</span>`;
        return `<tr data-id="${escapeHtml(lead.id)}">
          <td class="col-num">${escapeHtml(date)}</td>
          <td class="col-name">${escapeHtml(lead.name || "—")}</td>
          <td class="col-email">${escapeHtml(lead.email || "—")}</td>
          <td class="col-num">${escapeHtml(lead.phone || "—")}</td>
          <td>${escapeHtml((lead.lang || "—").toUpperCase())}</td>
          <td class="col-num">${lead.level != null ? escapeHtml(String(lead.level)) + "%" : "—"}</td>
          <td>${tags || "—"}</td>
          <td>${waBtn}</td>
          <td><button type="button" class="btn-icon-ghost" data-del="${escapeHtml(lead.id)}">Apagar</button></td>
        </tr>`;
      })
      .join("");

    el.leadsTable.innerHTML = `
      <thead>
        <tr>
          <th>Data</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>WhatsApp</th>
          <th>Idioma</th>
          <th>Urgência</th>
          <th>Sinais</th>
          <th>Chamar</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>`;

    el.leadsTable.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del");
        if (!id || !Store) return;
        if (!confirm("Apagar este lead da lista compartilhada (some para o time)?")) return;
        if (typeof Store.removeAndSync === "function") await Store.removeAndSync(id);
        else Store.remove(id);
        renderLeads();
      });
    });
  }

  function exportCsv() {
    if (!Store) return;
    const { filtered } = getFilteredLeads();
    const csv = Store.toCsv(filtered);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const suffix = dayFilter || new Date().toISOString().slice(0, 10);
    a.download = `leads-birra-${suffix}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportJsonBackup() {
    if (!Store) return;
    const data = Store.readAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-birra-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
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

  function applyDayFilter(value) {
    dayFilter = value || "";
    loadAll();
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
  if (el.btnLeadsRefresh)
    el.btnLeadsRefresh.addEventListener("click", async () => {
      if (Store && typeof Store.sync === "function") await Store.sync();
      renderLeads();
    });
  if (el.filterDate) {
    el.filterDate.addEventListener("change", () => {
      applyDayFilter(el.filterDate.value || "");
    });
  }
  if (el.btnAllDates) {
    el.btnAllDates.addEventListener("click", () => {
      applyDayFilter("");
    });
  }
  if (el.btnLeadsExport) el.btnLeadsExport.addEventListener("click", () => exportCsv());
  if (el.btnLeadsExportJson) el.btnLeadsExportJson.addEventListener("click", () => exportJsonBackup());
  if (el.btnLeadsImport && el.leadsFile) {
    el.btnLeadsImport.addEventListener("click", () => el.leadsFile.click());
    el.leadsFile.addEventListener("change", async () => {
      const file = el.leadsFile.files && el.leadsFile.files[0];
      el.leadsFile.value = "";
      if (!file || !Store) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : data.leads || data.items || [];
        Store.importMerge(arr);
        renderLeads();
        alert(`Importado. Total agora: ${Store.readAll().length} leads.`);
      } catch {
        alert("Arquivo JSON inválido.");
      }
    });
  }
  if (el.btnLeadsClear) {
    el.btnLeadsClear.addEventListener("click", () => {
      if (!Store) return;
      if (
        !confirm(
          "Apagar TODOS os leads da lista COMPARTILHADA (some para o time)? Exporte CSV antes se precisar."
        )
      )
        return;
      Store.clear();
      renderLeads();
    });
  }
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
