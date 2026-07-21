/**
 * Armazenamento de leads (local, permanente neste navegador).
 * Chave: birra_leads — compartilhada entre o quiz e /dadosquizz/
 */
(function () {
  const KEY = "birra_leads";
  const MAX = 2000;

  function readAll() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function writeAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
  }

  function add(lead) {
    const list = readAll();
    const row = {
      id: lead.id || `L${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(lead.name || "").trim(),
      email: String(lead.email || "").trim(),
      phone: String(lead.phone || "").trim(),
      who: String(lead.who || "").trim(),
      whoLabel: String(lead.whoLabel || "").trim(),
      ts: lead.ts || Date.now(),
      lang: lead.lang || "",
      score: lead.score ?? null,
      level: lead.level ?? null,
      tags: Array.isArray(lead.tags) ? lead.tags : [],
    };
    list.push(row);
    writeAll(list);
    return row;
  }

  function remove(id) {
    writeAll(readAll().filter((x) => x.id !== id));
  }

  function clear() {
    writeAll([]);
  }

  function importMerge(incoming) {
    if (!Array.isArray(incoming)) return readAll();
    const list = readAll();
    const seen = new Set(list.map((x) => x.id));
    incoming.forEach((row) => {
      if (!row || typeof row !== "object") return;
      const id = row.id || `L${row.ts || Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (seen.has(id)) return;
      seen.add(id);
      list.push({
        id,
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
      });
    });
    list.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    writeAll(list);
    return list;
  }

  /** Só dígitos; se não tiver DDI e tiver 10–11 dígitos, assume BR (+55). */
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
    clear,
    importMerge,
    phoneDigits,
    whatsappUrl,
    formatDate,
    toCsv,
  };
})();
