# Quiz — Berrinche Cero / Birra Zero

Quiz interativo (mobile-first) + páginas de funil (obrigado, upsell, downsell).

## Como abrir

```bash
cd quizz-pagina-birra
python3 -m http.server 8877
```

| Página | URL local |
|--------|-----------|
| Quiz | http://127.0.0.1:8877/ |
| Obrigado | http://127.0.0.1:8877/obrigado/ |
| Upsell | http://127.0.0.1:8877/upsell/ |
| Downsell | http://127.0.0.1:8877/downsell/ |
| **Dados do quiz (interno)** | http://127.0.0.1:8877/dadosquizz/ |

## Fluxo quiz

1. Hero + seletor ES / PT / EN  
2. 12 perguntas com imagens  
3. Matérias após as perguntas **4, 8 e 12**  
4. Loading ~3s  
5. Resultado urgente + CTA Hotmart  

## Funil (pós-compra / oferta)

| Rota | Conteúdo |
|------|----------|
| `/obrigado/` | Confirmação de compra + próximos passos |
| `/upsell/` | **Implementación Rápida** (complemento avançado) |
| `/downsell/` | **Protocolo Núcleo 7 Minutos** (versão mínima) |

### Painel interno `/dadosquizz/`

- Relatório de funil: visitas → cada pergunta → notícias → resultado → clique no checkout  
- Senha padrão: veja `js/analytics-config.js` → `dashboardPassword` (troque!)  
- `noindex` (não para clientes)  
- Contadores via CounterAPI + espelho local

## Arquivos

| Pasta / arquivo | Função |
|-----------------|--------|
| `index.html` | Quiz |
| `css/styles.css` | Design system |
| `css/funnel.css` | Páginas do funil |
| `js/i18n.js` + `app.js` + `motion.js` | Quiz |
| `js/funnel-i18n.js` + `funnel.js` | Funil ES/PT/EN |
| `obrigado/` `upsell/` `downsell/` | Rotas |
| `assets/images/` | Cenas |
