/**
 * Config do painel /dadosquizz e da telemetria do quiz.
 * Altere a senha antes de divulgar a URL do painel.
 */
window.ANALYTICS_CONFIG = {
  /** Namespace único no CounterAPI (contadores públicos por chave) */
  namespace: "birraquizz-erkni",
  /** Senha do painel privado (só quem sabe a URL + senha) */
  dashboardPassword: "birra2026",
  /** API base — free multi-visitante, sem backend nosso */
  counterApiBase: "https://api.counterapi.dev/v1",
  /** Chaves do funil (ordem = funil) */
  funnelKeys: [
    { key: "visit", label: "Acessou o quiz", labelEs: "Accedió al quiz", labelEn: "Opened quiz" },
    { key: "start", label: "Clicou em começar", labelEs: "Clicó en empezar", labelEn: "Clicked start" },
    { key: "q1", label: "Pergunta 1", labelEs: "Pregunta 1", labelEn: "Question 1" },
    { key: "q2", label: "Pergunta 2", labelEs: "Pregunta 2", labelEn: "Question 2" },
    { key: "q3", label: "Pergunta 3", labelEs: "Pregunta 3", labelEn: "Question 3" },
    { key: "q4", label: "Pergunta 4", labelEs: "Pregunta 4", labelEn: "Question 4" },
    { key: "news_n1", label: "Notícia 1 (após Q4)", labelEs: "Noticia 1 (tras Q4)", labelEn: "News 1 (after Q4)" },
    { key: "q5", label: "Pergunta 5", labelEs: "Pregunta 5", labelEn: "Question 5" },
    { key: "q6", label: "Pergunta 6", labelEs: "Pregunta 6", labelEn: "Question 6" },
    { key: "q7", label: "Pergunta 7", labelEs: "Pregunta 7", labelEn: "Question 7" },
    { key: "q8", label: "Pergunta 8", labelEs: "Pregunta 8", labelEn: "Question 8" },
    { key: "news_n2", label: "Notícia 2 (após Q8)", labelEs: "Noticia 2 (tras Q8)", labelEn: "News 2 (after Q8)" },
    { key: "q9", label: "Pergunta 9", labelEs: "Pregunta 9", labelEn: "Question 9" },
    { key: "q10", label: "Pergunta 10", labelEs: "Pregunta 10", labelEn: "Question 10" },
    { key: "q11", label: "Pergunta 11", labelEs: "Pregunta 11", labelEn: "Question 11" },
    { key: "q12", label: "Pergunta 12", labelEs: "Pregunta 12", labelEn: "Question 12" },
    { key: "news_n3", label: "Notícia 3 (após Q12)", labelEs: "Noticia 3 (tras Q12)", labelEn: "News 3 (after Q12)" },
    { key: "loading", label: "Tela carregando", labelEs: "Pantalla cargando", labelEn: "Loading screen" },
    { key: "result", label: "Viu o resultado", labelEs: "Vio el resultado", labelEn: "Saw result" },
    { key: "cta_checkout", label: "Clicou no checkout", labelEs: "Clicó en checkout", labelEn: "Clicked checkout" },
  ],
};
