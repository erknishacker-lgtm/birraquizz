# Quiz — Berrinche Cero / Birra Zero

Quiz interativo (mobile-first) + páginas de funil (obrigado, upsell, downsell).

**Produção:** https://birraquizzz.vercel.app

## Como abrir

```bash
cd quizz-pagina-birra
python3 -m http.server 8877
```

| Página | URL local | Produção |
|--------|-----------|----------|
| **Quiz principal (advertorial)** | http://127.0.0.1:8877/ | https://birraquizzz.vercel.app/ |
| Quiz clássico (legado) | http://127.0.0.1:8877/quiz2/ | https://birraquizzz.vercel.app/quiz2/ |
| Obrigado | http://127.0.0.1:8877/obrigado/ | /obrigado/ |
| Upsell | http://127.0.0.1:8877/upsell/ | /upsell/ |
| Downsell | http://127.0.0.1:8877/downsell/ | /downsell/ |
| **Dados do quiz (interno)** | http://127.0.0.1:8877/dadosquizz/ | /dadosquizz/ |

### Visual principal vs. legado

| Rota | Visual |
|------|--------|
| `/` | **Advertorial / VSL** (fundo branco, Oswald + Poppins, vermelho) — era o “quiz2” |
| `/quiz2/` | **Clássico** (app azul/laranja, Sora) — era a principal; `noindex` |

Ambos usam o mesmo funil, copy, leads, pixel e checkout Hotmart.

## Fluxo quiz (versão 12 perguntas)

1. Hero + seletor ES / PT / EN (~3–4 min)  
2. **Quebra-gelo** (2 perguntas) → micro recompensa  
3. **Dor** (4 perguntas) → micro alerta → prova social (vídeo)  
4. **Desejo** (3 perguntas) → micro cenário ideal  
5. **Ponte** (3 perguntas) → micro protocolo  
6. Diagnóstico → captura de lead (inclui “quem responde”) → loading  
7. Pitch / resultado + CTA Hotmart  

Versão longa (30 perguntas) arquivada em `archive/quiz-flow-30-perguntas.js`.

## Funil (pós-compra / oferta)

| Rota | Conteúdo |
|------|----------|
| `/obrigado/` | Confirmação de compra + próximos passos |
| `/upsell/` | **Implementación Rápida** (complemento avançado) |
| `/downsell/` | **Protocolo Núcleo 7 Minutos** (versão mínima) |

### Painel interno `/dadosquizz/`

- Relatório de funil: visitas → cada pergunta → micros → resultado → clique no checkout  
- **Leads capturados**: nome, e-mail, WhatsApp, quem responde, data, idioma, urgência  
- Exportar CSV / backup JSON / importar JSON  
- Senha: `js/analytics-config.js` → `dashboardPassword` (troque!)  

## Arquivos

| Pasta / arquivo | Função |
|-----------------|--------|
| `index.html` | Quiz |
| `js/quiz-flow.js` | Copy + fluxo (12 perguntas, ES/PT/EN) |
| `js/app.js` + `motion.js` | Motor do quiz |
| `js/funnel-i18n.js` + `funnel.js` | Funil pós-compra |
| `archive/` | Versão 30 perguntas + relatórios de copy |
| `obrigado/` `upsell/` `downsell/` | Rotas do funil |
| `assets/images/` | Cenas |
