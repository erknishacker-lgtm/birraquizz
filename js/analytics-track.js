/**
 * Telemetria do quiz → CounterAPI (+ espelho local + contagem por dia).
 * Uso: window.QuizAnalytics.track("q1")
 */
(function () {
  const CFG = window.ANALYTICS_CONFIG || {};
  const NS = CFG.namespace || "birraquizz";
  const BASE = (CFG.counterApiBase || "https://api.counterapi.dev/v1").replace(/\/$/, "");
  const LOCAL_KEY = "birra_analytics_local";
  const DAILY_KEY = "birra_analytics_daily";
  const SESSION_FLAGS = "birra_analytics_session_flags";

  function sessionFlags() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_FLAGS) || "{}");
    } catch {
      return {};
    }
  }

  function setSessionFlag(key) {
    const f = sessionFlags();
    f[key] = true;
    sessionStorage.setItem(SESSION_FLAGS, JSON.stringify(f));
  }

  function hasSessionFlag(key) {
    return !!sessionFlags()[key];
  }

  function localDayKey(ts) {
    const d = new Date(ts || Date.now());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function bumpLocal(key) {
    try {
      const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
      data[key] = (data[key] || 0) + 1;
      data._updated = Date.now();
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    } catch (_) {
      /* ignore quota */
    }
  }

  /** Contadores por dia (para filtrar o funil no painel). */
  function bumpDaily(key) {
    try {
      const day = localDayKey();
      const all = JSON.parse(localStorage.getItem(DAILY_KEY) || "{}");
      if (!all[day] || typeof all[day] !== "object") all[day] = {};
      all[day][key] = (Number(all[day][key]) || 0) + 1;
      all[day]._updated = Date.now();
      // mantém no máx. ~120 dias
      const days = Object.keys(all).sort();
      while (days.length > 120) {
        delete all[days.shift()];
      }
      localStorage.setItem(DAILY_KEY, JSON.stringify(all));
    } catch (_) {
      /* ignore */
    }
  }

  function hitRemote(key) {
    const url = `${BASE}/${encodeURIComponent(NS)}/${encodeURIComponent(key)}/up`;
    return fetch(url, { method: "GET", mode: "cors", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }

  /**
   * @param {string} key
   * @param {{ oncePerSession?: boolean }} [opts]
   */
  function track(key, opts) {
    if (!key) return;
    const once = opts && opts.oncePerSession;
    if (once && hasSessionFlag(key)) return;
    if (once) setSessionFlag(key);
    bumpLocal(key);
    bumpDaily(key);
    hitRemote(key);
  }

  function getLocal() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function getDailyAll() {
    try {
      const all = JSON.parse(localStorage.getItem(DAILY_KEY) || "{}");
      return all && typeof all === "object" ? all : {};
    } catch {
      return {};
    }
  }

  /** Contagens de um dia YYYY-MM-DD (somente neste navegador). */
  function getDaily(day) {
    const all = getDailyAll();
    const row = all[day];
    return row && typeof row === "object" ? row : {};
  }

  window.QuizAnalytics = {
    track,
    getLocal,
    getDaily,
    getDailyAll,
    localDayKey,
    DAILY_KEY,
    LOCAL_KEY,
  };
})();
