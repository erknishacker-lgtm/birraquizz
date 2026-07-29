/**
 * Painel /dados-sono — analisador de etapas do funil quiz-sono.
 * Lê exclusivamente via RPCs do Supabase (a tabela crua não é
 * legível pela chave publishable — ver dados-sono/schema.sql).
 */
(function () {
  const CFG = window.SONO_TRACKING_CONFIG || {};
  const REST = (CFG.supabaseUrl || '').replace(/\/$/, '') + '/rest/v1';
  const FUNNEL = CFG.funnel || 'quiz-sono';
  const PASS = CFG.dashboardPassword || 'sono2026';
  const AUTH_KEY = 'dados_sono_auth';

  const el = {
    gate: document.getElementById('auth-gate'),
    dash: document.getElementById('dashboard'),
    form: document.getElementById('auth-form'),
    pass: document.getElementById('auth-pass'),
    err: document.getElementById('auth-err'),
    status: document.getElementById('load-status'),
    summary: document.getElementById('summary-cards'),
    worst: document.getElementById('worst-drop'),
    funnelTable: document.getElementById('funnel-table'),
    sessionsTable: document.getElementById('sessions-table'),
    sessionsMeta: document.getElementById('sessions-meta'),
    btnRefresh: document.getElementById('btn-refresh'),
    btnLogout: document.getElementById('btn-logout'),
    btnExport: document.getElementById('btn-export-csv'),
    filterBar: document.getElementById('sono-filter-bar'),
    filterFrom: document.getElementById('filter-from'),
    filterTo: document.getElementById('filter-to'),
    btnApplyRange: document.getElementById('btn-apply-range'),
    filterHint: document.getElementById('filter-hint'),
    modal: document.getElementById('session-modal'),
    modalTitle: document.getElementById('session-modal-title'),
    modalBody: document.getElementById('session-modal-body'),
    modalClose: document.getElementById('session-modal-close'),
  };

  let currentRange = { mode: 'all', from: null, to: null };
  let lastSessions = [];

  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  }
  function setAuthed(v) {
    if (v) sessionStorage.setItem(AUTH_KEY, '1');
    else sessionStorage.removeItem(AUTH_KEY);
  }
  function showDash(show) {
    if (el.gate) el.gate.hidden = show;
    if (el.dash) el.dash.hidden = !show;
  }

  /* ---------------- Supabase RPC ---------------- */
  function rpc(name, params) {
    return fetch(`${REST}/rpc/${name}`, {
      method: 'POST',
      headers: {
        apikey: CFG.supabaseKey,
        Authorization: `Bearer ${CFG.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params || {}),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .catch((e) => {
        console.error(`RPC ${name} falhou`, e);
        return null;
      });
  }

  /* ---------------- filtro de tempo ---------------- */
  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function computeRange(mode) {
    const now = new Date();
    switch (mode) {
      case 'hour':
        return { from: new Date(now.getTime() - 60 * 60 * 1000), to: null };
      case 'today':
        return { from: startOfDay(now), to: null };
      case 'yesterday': {
        const y = startOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
        const end = startOfDay(now);
        return { from: y, to: end };
      }
      case '7d':
        return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: null };
      case 'all':
      default:
        return { from: null, to: null };
    }
  }

  function labelForRange(mode, from, to) {
    if (mode === 'range') {
      const f = from ? from.toLocaleDateString('pt-BR') : '—';
      const t = to ? to.toLocaleDateString('pt-BR') : 'hoje';
      return `intervalo de ${f} até ${t}`;
    }
    return (
      {
        hour: 'última hora',
        today: 'hoje',
        yesterday: 'ontem',
        '7d': 'últimos 7 dias',
        all: 'tudo',
      }[mode] || 'tudo'
    );
  }

  function applyRange(mode) {
    const { from, to } = computeRange(mode);
    currentRange = { mode, from, to };
    el.filterBar.querySelectorAll('.chip-filter').forEach((b) => b.classList.toggle('is-active', b.dataset.range === mode));
    if (el.filterHint) el.filterHint.textContent = `Mostrando: ${labelForRange(mode)}.`;
    loadAll();
  }

  function applyCustomRange() {
    const fromVal = el.filterFrom.value;
    const toVal = el.filterTo.value;
    const from = fromVal ? startOfDay(new Date(fromVal + 'T00:00:00')) : null;
    let to = null;
    if (toVal) {
      to = startOfDay(new Date(toVal + 'T00:00:00'));
      to.setDate(to.getDate() + 1); // inclui o dia "até"
    }
    currentRange = { mode: 'range', from, to };
    el.filterBar.querySelectorAll('.chip-filter').forEach((b) => b.classList.remove('is-active'));
    if (el.filterHint) el.filterHint.textContent = `Mostrando: ${labelForRange('range', from, toVal ? new Date(toVal) : null)}.`;
    loadAll();
  }

  /* ---------------- formatação ---------------- */
  function fmtMs(ms) {
    if (ms == null || Number.isNaN(ms)) return '—';
    const s = Math.round(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  }
  function fmtDate(ts) {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(ts);
    }
  }
  function pct(n, d) {
    if (!d) return 0;
    return Math.round((n / d) * 1000) / 10;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------------- carregar tudo ---------------- */
  async function loadAll() {
    if (el.status) el.status.textContent = 'Carregando…';
    const params = {
      p_funnel: FUNNEL,
      p_from: currentRange.from ? currentRange.from.toISOString() : null,
      p_to: currentRange.to ? currentRange.to.toISOString() : null,
    };

    const [summary, steps, sessions] = await Promise.all([
      rpc('get_funnel_summary', params),
      rpc('get_funnel_dashboard', params),
      rpc('get_funnel_sessions', { ...params, p_limit: 1000 }),
    ]);

    renderSummary(summary && summary[0]);
    renderFunnelTable(steps || []);
    renderWorst(steps || []);
    lastSessions = sessions || [];
    renderSessions(lastSessions);

    if (el.status) {
      const ok = summary != null && steps != null && sessions != null;
      el.status.textContent = ok
        ? `Atualizado: ${new Date().toLocaleString('pt-BR')} · dados reais do Supabase`
        : `⚠️ Falha ao carregar do Supabase — confira se rodou o schema.sql e as credenciais em js/sono-tracking-config.js`;
    }
  }

  function renderSummary(s) {
    if (!el.summary) return;
    const total = (s && s.total_sessions) || 0;
    const completed = (s && s.completed_sessions) || 0;
    const converted = (s && s.converted_sessions) || 0;
    const avgTime = s ? s.avg_time_on_site_ms : null;
    const cards = [
      { label: 'Visitantes (sessões)', value: total },
      { label: 'Completaram o quiz', value: completed, sub: total ? `${pct(completed, total)}% dos visitantes` : '' },
      { label: 'Clicaram no checkout', value: converted, sub: total ? `${pct(converted, total)}% dos visitantes` : '' },
      { label: 'Tempo médio no site', value: fmtMs(avgTime) },
    ];
    el.summary.innerHTML = cards
      .map(
        (c) => `
      <div class="stat-card">
        <p class="stat-label">${escapeHtml(c.label)}</p>
        <p class="stat-value">${c.value}</p>
        ${c.sub ? `<p class="stat-sub">${escapeHtml(c.sub)}</p>` : ''}
      </div>`
      )
      .join('');
  }

  function renderFunnelTable(steps) {
    if (!el.funnelTable) return;
    const sorted = steps.slice().sort((a, b) => a.step_index - b.step_index);
    const base = sorted.length ? sorted[0].sessions_reached : 0;
    let rows = '';
    let prev = null;
    sorted.forEach((st) => {
      const n = Number(st.sessions_reached) || 0;
      const reach = pct(n, base || 1);
      let drop = '—';
      let dropCls = '';
      if (prev !== null && prev > 0) {
        const lost = Math.max(0, prev - n);
        const d = pct(lost, prev);
        drop = `${d}% (−${lost})`;
        if (d >= 25) dropCls = 'is-bad';
        else if (d >= 12) dropCls = 'is-warn';
      }
      rows += `
        <tr>
          <td class="col-step"><span class="step-idx">${st.step_index + 1}</span> ${escapeHtml(st.step_title || st.step_id || '')}</td>
          <td class="col-num">${n}</td>
          <td class="col-pct">
            <div class="mini-bar"><i style="width:${Math.min(100, reach)}%"></i></div>
            <span>${reach}%</span>
          </td>
          <td class="col-num">${fmtMs(st.avg_time_ms)}</td>
          <td class="col-drop ${dropCls}">${drop}</td>
        </tr>`;
      prev = n;
    });
    el.funnelTable.innerHTML = `
      <thead>
        <tr>
          <th>Etapa</th>
          <th>Pessoas</th>
          <th>% que chegou</th>
          <th>Tempo médio na etapa</th>
          <th>Queda vs anterior</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="5">Sem dados no período.</td></tr>'}</tbody>`;
  }

  function renderWorst(steps) {
    if (!el.worst) return;
    const sorted = steps.slice().sort((a, b) => a.step_index - b.step_index);
    let worst = null;
    let prev = null;
    let prevLabel = '';
    sorted.forEach((st) => {
      const n = Number(st.sessions_reached) || 0;
      if (prev !== null && prev > 0) {
        const lost = Math.max(0, prev - n);
        const d = lost / prev;
        if (!worst || d > worst.d) worst = { from: prevLabel, to: st.step_title || st.step_id, d, lost };
      }
      prevLabel = st.step_title || st.step_id;
      prev = n;
    });
    if (!worst || worst.d <= 0) {
      el.worst.innerHTML = `<p class="funnel-muted">Ainda não há queda relevante (poucos dados no período).</p>`;
      return;
    }
    const p = Math.round(worst.d * 1000) / 10;
    el.worst.innerHTML = `
      <div class="funnel-box is-warn">
        <h3>Maior gargalo</h3>
        <p>Entre <strong>${escapeHtml(worst.from)}</strong> e <strong>${escapeHtml(worst.to)}</strong>:
        <strong>${p}%</strong> saíram (−${worst.lost} pessoas).</p>
      </div>`;
  }

  function statusBadge(s) {
    if (s.converted) return '<span class="badge is-ok">Converteu</span>';
    if (s.completed) return '<span class="badge is-mid">Completou</span>';
    return '<span class="badge is-bad">Abandonou</span>';
  }

  function renderSessions(sessions) {
    if (!el.sessionsTable) return;
    if (el.sessionsMeta) {
      el.sessionsMeta.textContent = sessions.length
        ? `${sessions.length} sessão${sessions.length === 1 ? '' : 'ões'} no período (máx. 1000 exibidas)`
        : 'Nenhuma sessão no período.';
    }
    if (!sessions.length) {
      el.sessionsTable.innerHTML = '<tbody><tr><td>Sem visitantes neste período.</td></tr></tbody>';
      return;
    }
    const rows = sessions
      .map((s) => {
        const step = s.total_steps ? `${(s.max_step_index || 0) + 1}/${s.total_steps}` : `${(s.max_step_index || 0) + 1}`;
        return `<tr data-session="${escapeHtml(s.session_id)}">
          <td class="col-num">${fmtDate(s.started_at)}</td>
          <td>${escapeHtml(s.device_type || '—')} · ${escapeHtml(s.browser || '—')}</td>
          <td>${escapeHtml(s.current_step_title || s.current_step_id || '—')} <span class="funnel-muted">(${step})</span></td>
          <td class="col-num">${fmtMs(s.time_on_site_ms)}</td>
          <td>${escapeHtml(s.utm_source || s.referrer || 'direto')}</td>
          <td>${statusBadge(s)}</td>
        </tr>`;
      })
      .join('');
    el.sessionsTable.innerHTML = `
      <thead>
        <tr>
          <th>Entrou em</th>
          <th>Dispositivo</th>
          <th>Última etapa</th>
          <th>Tempo no site</th>
          <th>Origem</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>`;
    el.sessionsTable.querySelectorAll('tr[data-session]').forEach((tr) => {
      tr.addEventListener('click', () => openSessionDetail(tr.getAttribute('data-session')));
    });
  }

  /* ---------------- detalhe da sessão ---------------- */
  const EVENT_LABEL = {
    session_start: 'Entrou no quiz',
    step_view: 'Viu a etapa',
    step_exit: 'Saiu da etapa',
    answer: 'Respondeu',
    button_click: 'Clicou em botão',
    cta_click: 'Clicou no checkout',
  };

  async function openSessionDetail(sessionId) {
    const session = lastSessions.find((s) => s.session_id === sessionId);
    el.modalTitle.textContent = session ? `Jornada — ${fmtDate(session.started_at)}` : 'Jornada da sessão';
    el.modalBody.innerHTML = '<p class="funnel-muted">Carregando…</p>';
    el.modal.hidden = false;

    const events = await rpc('get_session_events', { p_session_id: sessionId });
    if (!events) {
      el.modalBody.innerHTML = '<p class="funnel-muted">Falha ao carregar eventos.</p>';
      return;
    }

    const meta = session
      ? `
      <div class="sono-session-meta">
        <div><strong>${fmtMs(session.time_on_site_ms)}</strong>tempo total</div>
        <div><strong>${session.max_step_index + 1}${session.total_steps ? '/' + session.total_steps : ''}</strong>etapa mais avançada</div>
        <div><strong>${session.converted ? 'Sim' : 'Não'}</strong>clicou no checkout</div>
        <div><strong>${escapeHtml(session.device_type || '—')}</strong>${escapeHtml(session.browser || '')} · ${escapeHtml(session.os || '')}</div>
      </div>`
      : '';

    const items = events
      .map((e) => {
        let detail = '';
        if (e.event_type === 'answer' && e.payload) {
          detail = `${escapeHtml(e.payload.option_label || '')}${e.payload.selected === false ? ' (desmarcou)' : ''}`;
        } else if (e.event_type === 'step_exit' && e.time_on_step_ms != null) {
          detail = `ficou ${fmtMs(e.time_on_step_ms)} nesta etapa`;
        } else if (e.event_type === 'button_click' && e.payload) {
          detail = escapeHtml(e.payload.label || '');
        }
        const stepLabel = e.step_title || e.step_id ? ` — ${escapeHtml(e.step_title || e.step_id)}` : '';
        return `
        <div class="sono-timeline-item">
          <div class="t-time">${fmtDate(e.created_at)}</div>
          <div class="t-label">${EVENT_LABEL[e.event_type] || e.event_type}${stepLabel}</div>
          ${detail ? `<div class="t-detail">${detail}</div>` : ''}
        </div>`;
      })
      .join('');

    el.modalBody.innerHTML = `${meta}<div class="sono-timeline">${items || '<p class="funnel-muted">Sem eventos.</p>'}</div>`;
  }

  /* ---------------- CSV ---------------- */
  function exportCsv() {
    const header = ['inicio', 'dispositivo', 'navegador', 'ultima_etapa', 'etapa_max', 'total_etapas', 'tempo_site_s', 'origem', 'completou', 'converteu'];
    const esc = (v) => {
      const s = String(v ?? '');
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(';')];
    lastSessions.forEach((s) => {
      lines.push(
        [
          fmtDate(s.started_at),
          s.device_type,
          s.browser,
          s.current_step_title || s.current_step_id,
          (s.max_step_index || 0) + 1,
          s.total_steps,
          Math.round((s.time_on_site_ms || 0) / 1000),
          s.utm_source || s.referrer || 'direto',
          s.completed ? 'sim' : 'nao',
          s.converted ? 'sim' : 'nao',
        ]
          .map(esc)
          .join(';')
      );
    });
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sessoes-quiz-sono-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------------- eventos de UI ---------------- */
  if (el.form) {
    el.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if ((el.pass && el.pass.value) === PASS) {
        setAuthed(true);
        if (el.err) el.err.hidden = true;
        showDash(true);
        applyRange('all');
      } else if (el.err) {
        el.err.hidden = false;
        el.err.textContent = 'Senha incorreta.';
      }
    });
  }
  if (el.btnRefresh) el.btnRefresh.addEventListener('click', loadAll);
  if (el.btnLogout)
    el.btnLogout.addEventListener('click', () => {
      setAuthed(false);
      showDash(false);
      if (el.pass) el.pass.value = '';
    });
  if (el.filterBar)
    el.filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-filter');
      if (btn) applyRange(btn.dataset.range);
    });
  if (el.btnApplyRange) el.btnApplyRange.addEventListener('click', applyCustomRange);
  if (el.btnExport) el.btnExport.addEventListener('click', exportCsv);
  if (el.modalClose) el.modalClose.addEventListener('click', () => (el.modal.hidden = true));
  if (el.modal)
    el.modal.addEventListener('click', (e) => {
      if (e.target === el.modal) el.modal.hidden = true;
    });

  if (isAuthed()) {
    showDash(true);
    applyRange('all');
  } else {
    showDash(false);
  }
})();
