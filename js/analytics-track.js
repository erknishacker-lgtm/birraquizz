/**
 * Telemetria do quiz → CounterAPI (+ espelho local).
 * Uso: window.QuizAnalytics.track("q1")
 */
(function () {
  const CFG = window.ANALYTICS_CONFIG || {};
  const NS = CFG.namespace || "birraquizz";
  const BASE = (CFG.counterApiBase || "https://api.counterapi.dev/v1").replace(/\/$/, "");
  const LOCAL_KEY = "birra_analytics_local";
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

  function hitRemote(key) {
    const url = `${BASE}/${encodeURIComponent(NS)}/${encodeURIComponent(key)}/up`;
    // fire-and-forget; no-cors not needed for counterapi (CORS ok usually)
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
    hitRemote(key);
  }

  window.QuizAnalytics = {
    track,
    getLocal: () => {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
      } catch {
        return {};
      }
    },
  };
})();
