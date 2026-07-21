/**
 * Leads compartilhados (iguais em todos os navegadores) + cache local.
 *
 * Fonte de verdade remota: JSONBlob (mesmo ID para o time)
 * Backup no repo: data/leads.json (via GitHub Action)
 * Cache: localStorage (offline / velocidade)
 */
(function () {
  const KEY = "birra_leads";
  const MAX = 2000;
  const CFG = () => window.ANALYTICS_CONFIG || {};

  let _resolvedRemote = null;

  function remoteConfig() {
    const c = CFG().leadsRemote || {};
    return {
      blobId: c.blobId || "019f859b-edd4-7da2-8110-ad1775d47918",
      blobBase: (c.blobBase || "https://jsonblob.com/api/jsonBlob").replace(/\/$/, ""),
      backupUrl:
        c.backupUrl ||
        "https://raw.githubusercontent.com/erknishacker-lgtm/birraquizz/main/data/leads.json",
      pointerUrl:
        c.pointerUrl ||
        "https://raw.githubusercontent.com/erknishacker-lgtm/birraquizz/main/data/leads-remote.json",
    };
  }

  /** Atualiza blobId a partir do ponteiro no GitHub (se a Action recriar o blob). */
  async function resolveRemote() {
    if (_resolvedRemote) return _resolvedRemote;
    const base = remoteConfig();
    try {
      const r = await fetch(base.pointerUrl + "?t=" + Date.now(), { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (j && j.blobId) {
          _resolvedRemote = {
            ...base,
            blobId: j.blobId,
            blobBase: (j.blobBase || base.blobBase).replace(/\/$/, ""),
          };
          return _resolvedRemote;
        }
      }
    } catch (_) {
      /* use config defaults */
    }
    _resolvedRemote = base;
    return _resolvedRemote;
  }

  function blobUrlFrom(cfg) {
    return `${cfg.blobBase}/${cfg.blobId}`;
  }

  function normalizeLead(row) {
    if (!row || typeof row !== "object") return null;
    return {
      id: row.id || `L${row.ts || Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(row.name || "").trim(),
      email: String(row.email || "").trim(),
      phone: String(row.phone || "").trim(),
      who: String(row.who || "").trim(),
      whoLabel: String(row.whoLabel || "").trim(),
      ts: Number(row.ts) || Date.now(),
      lang: row.lang || "",
      score: row.score ?? null,
      level: row.level ?? null,
      tags: Array.isArray(row.tags) ? row.tags : [],
    };
  }

  function mergeLists(a, b) {
    const map = new Map();
    [...(a || []), ...(b || [])].forEach((raw) => {
      const row = normalizeLead(raw);
      if (!row || !row.id) return;
      const prev = map.get(row.id);
      if (!prev || (row.ts || 0) >= (prev.ts || 0)) map.set(row.id, row);
    });
    return Array.from(map.values())
      .sort((x, y) => (x.ts || 0) - (y.ts || 0))
      .slice(-MAX);
  }

  function readLocal() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw.map(normalizeLead).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  function writeLocal(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify((list || []).slice(-MAX)));
    } catch (_) {
      /* quota */
    }
  }

  /** Leitura síncrona (cache local) — compatível com código antigo. */
  function readAll() {
    return readLocal();
  }

  async function fetchRemoteList() {
    const cfg = await resolveRemote();
    const url = blobUrlFrom(cfg) + "?t=" + Date.now();
    try {
      const r = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) return data.map(normalizeLead).filter(Boolean);
        if (data && Array.isArray(data.leads)) return data.leads.map(normalizeLead).filter(Boolean);
      }
    } catch (_) {
      /* fall through */
    }
    // Backup no GitHub (read-only)
    try {
      const r2 = await fetch(cfg.backupUrl + "?t=" + Date.now(), { cache: "no-store" });
      if (r2.ok) {
        const data = await r2.json();
        if (Array.isArray(data)) return data.map(normalizeLead).filter(Boolean);
      }
    } catch (_) {
      /* ignore */
    }
    return null; // null = remote falhou
  }

  async function putRemoteList(list) {
    const cfg = await resolveRemote();
    const url = blobUrlFrom(cfg);
    try {
      const r = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(list.slice(-MAX)),
      });
      return r.ok;
    } catch {
      return false;
    }
  }

  /**
   * Sincroniza: baixa remoto, mescla com local, grava nos dois lados.
   * @returns {Promise<{list: array, source: string, ok: boolean}>}
   */
  async function sync() {
    const local = readLocal();
    const remote = await fetchRemoteList();
    if (remote == null) {
      return { list: local, source: "local-only", ok: false };
    }
    const merged = mergeLists(local, remote);
    writeLocal(merged);
    const saved = await putRemoteList(merged);
    return {
      list: merged,
      source: saved ? "shared" : "shared-read-local-write-failed",
      ok: true,
    };
  }

  async function add(lead) {
    const row = normalizeLead({
      ...lead,
      id: lead.id || `L${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ts: lead.ts || Date.now(),
    });
    // 1) cache local imediato
    const local = readLocal();
    local.push(row);
    writeLocal(local);
    // 2) mescla com remoto e publica (todos os sócios veem)
    try {
      const remote = (await fetchRemoteList()) || [];
      const merged = mergeLists(remote, local);
      writeLocal(merged);
      await putRemoteList(merged);
    } catch (_) {
      /* local already has the lead */
    }
    return row;
  }

  function remove(id) {
    const next = readLocal().filter((x) => x.id !== id);
    writeLocal(next);
    // best-effort remote
    putRemoteList(next);
    return next;
  }

  async function removeAndSync(id) {
    const next = readLocal().filter((x) => x.id !== id);
    writeLocal(next);
    try {
      const remote = (await fetchRemoteList()) || [];
      const merged = mergeLists(
        remote.filter((x) => x.id !== id),
        next
      );
      writeLocal(merged);
      await putRemoteList(merged);
      return merged;
    } catch {
      return next;
    }
  }

  function clear() {
    writeLocal([]);
    putRemoteList([]);
  }

  function importMerge(incoming) {
    if (!Array.isArray(incoming)) return readLocal();
    const merged = mergeLists(readLocal(), incoming);
    writeLocal(merged);
    putRemoteList(merged);
    return merged;
  }

  function phoneDigits(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length >= 10 && d.length <= 11 && !d.startsWith("55")) d = "55" + d;
    return d;
  }

  function whatsappUrl(phone, message) {
    const d = phoneDigits(phone);
    if (!d) return "";
    let url = `https://wa.me/${d}`;
    if (message) url += `?text=${encodeURIComponent(message)}`;
    return url;
  }

  function formatDate(ts, locale) {
    try {
      return new Date(ts).toLocaleString(locale || "pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(ts || "");
    }
  }

  function toCsv(list) {
    const rows = list || readAll();
    const header = ["id", "data", "nome", "email", "whatsapp", "idioma", "score", "nivel", "tags"];
    const esc = (v) => {
      const s = String(v ?? "");
      if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [header.join(";")];
    rows
      .slice()
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
      .forEach((r) => {
        lines.push(
          [
            r.id,
            formatDate(r.ts),
            r.name,
            r.email,
            r.phone,
            r.lang,
            r.score ?? "",
            r.level ?? "",
            (r.tags || []).join(" | "),
          ]
            .map(esc)
            .join(";")
        );
      });
    return lines.join("\n");
  }

  window.LeadsStore = {
    KEY,
    readAll,
    add,
    remove,
    removeAndSync,
    clear,
    importMerge,
    sync,
    fetchRemoteList,
    phoneDigits,
    whatsappUrl,
    formatDate,
    toCsv,
  };
})();
