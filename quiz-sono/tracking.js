/* ==========================================================
   Rastreamento real de sessão — quiz-sono
   Fonte de verdade: Supabase (não localStorage).
   Cada visitante gera uma sessão gravada no banco desde o
   primeiro passo, atualizada a cada etapa + heartbeat + saída,
   para minimizar perda de dado mesmo se ele fechar a aba.
   ========================================================== */
(function () {
  'use strict';

  const CFG = window.SONO_TRACKING_CONFIG || {};
  if (!CFG.supabaseUrl || !CFG.supabaseKey) {
    window.FunnelTracker = { init() {}, enterStep() {}, trackAnswer() {}, trackButtonClick() {}, trackCheckoutClick() {} };
    return;
  }

  const REST = CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1';
  const FUNNEL = CFG.funnel || 'quiz-sono';
  const HEARTBEAT_MS = 15000;

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    try {
      let id = localStorage.getItem('sono_visitor_id');
      if (!id) {
        id = uuid();
        localStorage.setItem('sono_visitor_id', id);
      }
      return id;
    } catch (_) {
      return uuid();
    }
  }

  function getSessionId() {
    try {
      let id = sessionStorage.getItem('sono_session_id');
      if (!id) {
        id = uuid();
        sessionStorage.setItem('sono_session_id', id);
      }
      return id;
    } catch (_) {
      return uuid();
    }
  }

  function parseUTM() {
    const p = new URLSearchParams(location.search);
    return {
      utm_source: p.get('utm_source') || null,
      utm_medium: p.get('utm_medium') || null,
      utm_campaign: p.get('utm_campaign') || null,
      utm_content: p.get('utm_content') || null,
      utm_term: p.get('utm_term') || null,
    };
  }

  function detectDevice() {
    const ua = navigator.userAgent || '';
    let device = 'desktop';
    if (/tablet|ipad/i.test(ua)) device = 'tablet';
    else if (/mobile|android|iphone/i.test(ua)) device = 'mobile';

    let browser = 'outro';
    if (/edg\//i.test(ua)) browser = 'edge';
    else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) browser = 'chrome';
    else if (/firefox\//i.test(ua)) browser = 'firefox';
    else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) browser = 'safari';

    let os = 'outro';
    if (/windows/i.test(ua)) os = 'windows';
    else if (/android/i.test(ua)) os = 'android';
    else if (/iphone|ipad|ios/i.test(ua)) os = 'ios';
    else if (/mac os/i.test(ua)) os = 'macos';
    else if (/linux/i.test(ua)) os = 'linux';

    return { device, browser, os };
  }

  function supaFetch(path, opts, keepalive) {
    const o = opts || {};
    return fetch(`${REST}/${path}`, {
      method: o.method || 'GET',
      body: o.body,
      keepalive: !!keepalive,
      headers: {
        apikey: CFG.supabaseKey,
        Authorization: `Bearer ${CFG.supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: o.prefer || 'return=minimal',
      },
    }).catch(() => null);
  }

  // Toda escrita espera a sessão existir de fato no banco antes de sair
  // (funnel_events tem FK pra funnel_sessions; sem isso a 1ª etapa se perdia).
  let sessionReady = Promise.resolve();

  function insertEvent(evt, keepalive) {
    const send = () => {
      const body = JSON.stringify([
        {
          session_id: state.sessionId,
          funnel: FUNNEL,
          created_at: new Date().toISOString(),
          ...evt,
        },
      ]);
      return supaFetch('funnel_events', { method: 'POST', body }, keepalive);
    };
    return sessionReady.then(send, send);
  }

  function patchSession(fields, keepalive) {
    const send = () => {
      const body = JSON.stringify(fields);
      return supaFetch(
        `funnel_sessions?session_id=eq.${state.sessionId}`,
        { method: 'PATCH', body },
        keepalive
      );
    };
    return sessionReady.then(send, send);
  }

  const state = {
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    startedAt: Date.now(),
    stepEnteredAt: null,
    current: null, // {index, id, title}
    totalSteps: 0,
    maxStepIndex: 0,
    heartbeatTimer: null,
  };

  function timeOnSite() {
    return Date.now() - state.startedAt;
  }

  function init(totalSteps) {
    state.totalSteps = totalSteps || 0;
    const dev = detectDevice();
    const utm = parseUTM();

    const body = JSON.stringify({
      session_id: state.sessionId,
      visitor_id: state.visitorId,
      funnel: FUNNEL,
      started_at: new Date(state.startedAt).toISOString(),
      last_seen_at: new Date(state.startedAt).toISOString(),
      total_steps: state.totalSteps,
      referrer: document.referrer || null,
      landing_url: location.href,
      device_type: dev.device,
      browser: dev.browser,
      os: dev.os,
      user_agent: navigator.userAgent,
      language: navigator.language || null,
      screen_w: screen.width || null,
      screen_h: screen.height || null,
      ...utm,
    });
    // insert simples: on_conflict/upsert exige permissão implícita de SELECT
    // que a role anon não tem (de propósito). Se a mesma aba re-executar o
    // boot, a 2ª tentativa dá 409 (chave duplicada) e é ignorada — sem problema,
    // a sessão já existe.
    sessionReady = supaFetch('funnel_sessions', { method: 'POST', body, prefer: 'return=minimal' });
    insertEvent({ event_type: 'session_start' });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush(false);
    });
    window.addEventListener('pagehide', () => flush(true));

    state.heartbeatTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        patchSession({ last_seen_at: new Date().toISOString(), time_on_site_ms: timeOnSite() });
      }
    }, HEARTBEAT_MS);
  }

  function enterStep(step, index, totalSteps) {
    const now = Date.now();
    if (state.current && state.stepEnteredAt != null) {
      insertEvent({
        event_type: 'step_exit',
        step_index: state.current.index,
        step_id: state.current.id,
        step_title: state.current.title,
        time_on_step_ms: now - state.stepEnteredAt,
      });
    }

    state.current = { index, id: step.id, title: step.title || '' };
    state.stepEnteredAt = now;
    if (totalSteps) state.totalSteps = totalSteps;
    if (index > state.maxStepIndex) state.maxStepIndex = index;

    insertEvent({
      event_type: 'step_view',
      step_index: index,
      step_id: step.id,
      step_title: step.title || '',
    });

    patchSession({
      last_seen_at: new Date().toISOString(),
      current_step_index: index,
      current_step_id: step.id,
      current_step_title: step.title || '',
      max_step_index: state.maxStepIndex,
      total_steps: state.totalSteps,
      completed: state.totalSteps ? state.maxStepIndex >= state.totalSteps - 1 : false,
      time_on_site_ms: timeOnSite(),
    });
  }

  function trackAnswer(step, option, selected) {
    insertEvent({
      event_type: 'answer',
      step_index: state.current ? state.current.index : null,
      step_id: step.id,
      step_title: step.title || '',
      payload: { option_id: option.id, option_label: stripHtml(option.label), selected: !!selected },
    });
  }

  function trackButtonClick(step, label) {
    insertEvent({
      event_type: 'button_click',
      step_index: state.current ? state.current.index : null,
      step_id: step.id,
      step_title: step.title || '',
      payload: { label: stripHtml(label) },
    });
  }

  function trackCheckoutClick(step) {
    insertEvent({
      event_type: 'cta_click',
      step_index: step ? state.current && state.current.index : null,
      step_id: step ? step.id : null,
      step_title: step ? step.title || '' : '',
    });
    patchSession({ converted: true, last_seen_at: new Date().toISOString(), time_on_site_ms: timeOnSite() });
  }

  function flush(isFinal) {
    const now = Date.now();
    if (state.current && state.stepEnteredAt != null) {
      insertEvent(
        {
          event_type: 'step_exit',
          step_index: state.current.index,
          step_id: state.current.id,
          step_title: state.current.title,
          time_on_step_ms: now - state.stepEnteredAt,
        },
        true
      );
      state.stepEnteredAt = now; // evita duplicar dwell se "hidden" disparar mais de uma vez
    }
    const fields = { last_seen_at: new Date().toISOString(), time_on_site_ms: timeOnSite() };
    if (isFinal) fields.ended_at = new Date().toISOString();
    patchSession(fields, true);
  }

  function stripHtml(s) {
    if (!s) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = s;
    return (tmp.textContent || '').trim();
  }

  window.FunnelTracker = { init, enterStep, trackAnswer, trackButtonClick, trackCheckoutClick };
})();
