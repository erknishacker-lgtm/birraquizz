/**
 * Config do painel /dadosquizz e da telemetria do quiz.
 * Altere a senha antes de divulgar a URL do painel.
 */
window.ANALYTICS_CONFIG = {
  namespace: "birraquizz-erkni",
  dashboardPassword: "birra2026",
  counterApiBase: "https://api.counterapi.dev/v1",
  /**
   * Leads compartilhados (mesmo armazenamento para todos os sócios).
   * Não é localStorage — os dois veem a mesma lista.
   */
  leadsRemote: {
    blobId: "019f859b-edd4-7da2-8110-ad1775d47918",
    blobBase: "https://jsonblob.com/api/jsonBlob",
    backupUrl: "https://raw.githubusercontent.com/erknishacker-lgtm/birraquizz/main/data/leads.json",
  },
  /** Funil versão 12 perguntas (Ice 2 · Pain 4 · Desire 3 · Bridge 3) — totais globais via CounterAPI */
  funnelKeys: [
    { key: "visit", label: "Acessou o quiz" },
    { key: "start", label: "Clicou em começar" },
    { key: "q1", label: "Q1 (quebra-gelo · frequência)" },
    { key: "q2", label: "Q2 (idade)" },
    { key: "m_ice", label: "Micro: recompensa" },
    { key: "q3", label: "Q3 (dor · local)" },
    { key: "q4", label: "Q4 (reação)" },
    { key: "q5", label: "Q5 (agressão)" },
    { key: "q6", label: "Q6 (adultos desalinhados)" },
    { key: "m_pain", label: "Micro: dor / notícia" },
    { key: "social_video", label: "Prova social (vídeo)" },
    { key: "q7", label: "Q7 (desejo · prioridade)" },
    { key: "q8", label: "Q8 (protocolo 7 min)" },
    { key: "q9", label: "Q9 (culpa vs ordem)" },
    { key: "m_desire", label: "Micro: desejo" },
    { key: "q10", label: "Q10 (ponte · travamento)" },
    { key: "q11", label: "Q11 (limites com método)" },
    { key: "q12", label: "Q12 (tempo em crise)" },
    { key: "m_bridge", label: "Micro: ponte" },
    { key: "eval", label: "Diagnóstico (avaliação)" },
    { key: "capture", label: "Tela de captura" },
    { key: "lead_capture", label: "Lead capturado (form ok)" },
    { key: "loading", label: "Loading" },
    { key: "result", label: "Pitch / resultado" },
    { key: "cta_checkout", label: "Clique checkout" },
  ],
};
