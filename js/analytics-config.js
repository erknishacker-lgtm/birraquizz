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
   */
  leadsRemote: {
    blobId: "019f859b-edd4-7da2-8110-ad1775d47918",
    blobBase: "https://jsonblob.com/api/jsonBlob",
    backupUrl: "https://raw.githubusercontent.com/erknishacker-lgtm/birraquizz/main/data/leads.json",
  },
  /** Funil 7 perguntas (ICP + hyperframes) */
  funnelKeys: [
    { key: "visit", label: "Acessou o quiz" },
    { key: "start", label: "Clicou em começar" },
    { key: "q1", label: "Q1 (ICP · idade)" },
    { key: "q2", label: "Q2 (frequência)" },
    { key: "m_connect", label: "Hyperframe: conexão ICP" },
    { key: "q3", label: "Q3 (dor · local)" },
    { key: "q4", label: "Q4 (reação)" },
    { key: "q5", label: "Q5 (tempo em crise)" },
    { key: "social_video", label: "Prova social (vídeo)" },
    { key: "q6", label: "Q6 (desejo)" },
    { key: "q7", label: "Q7 (ponte · protocolo)" },
    { key: "m_vision", label: "Hyperframe: visão" },
    { key: "eval", label: "Diagnóstico (avaliação)" },
    { key: "capture", label: "Tela de captura" },
    { key: "lead_capture", label: "Lead capturado (form ok)" },
    { key: "loading", label: "Loading" },
    { key: "result", label: "Pitch / resultado" },
    { key: "cta_checkout", label: "Clique checkout" },
  ],
};
