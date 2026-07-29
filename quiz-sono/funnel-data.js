// ==========================================================
// CONFIGURAÇÃO — edite aqui antes de publicar
// ==========================================================
const CONFIG = {
  // Checkout original do funil clonado: https://pay.hotmart.com/X71620859G?off=ya5dy8cq&checkoutMode=10
  checkoutUrl: "https://lastlink.com/p/CE7085910/checkout-payment/",
  // Pixel do Facebook original do funil clonado: 387041248925811 (deixe "" para desativar)
  fbPixelId: "",
};

// ==========================================================
// DADOS DO FUNIL — extraídos de inlead.digital/comofazerseufilhodormir-cfsfd0325q
// ==========================================================
const FUNNEL = 
{
  "title": "Manual completo de Como Fazer Seu Filho Dormir - [CFSFD0325Q]",
  "design": {
    "logo": {
      "type": "image",
      "src": "./assets/images/logo.png",
      "width": 667,
      "height": 363
    },
    "themeColor": "#2563eb",
    "contentColor": "#6b7280",
    "titleColor": "#030712",
    "backgroundColor": "#ffffff",
    "featuredFont": "inter",
    "contentFont": "inter",
    "titleSize": 0.5,
    "contentSize": 16,
    "rounded": "rounded-2xl",
    "elementSize": "56px"
  },
  "steps": [
    {
      "id": "SQSDzM",
      "title": "Etapa 1",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Para um manual completo de Como Fazer Seu Filho Dormir:</h1><p class=\"ql-align-center\"><strong style=\"background-color: inherit; color: rgb(9, 9, 11);\">Descubra o plano com ações práticas que&nbsp;</strong><strong style=\"background-color: inherit; color: rgb(37, 99, 235);\">realmente funcionam para fazer seu bebê dormir a noite toda. Comece selecionando a idade</strong><strong style=\"background-color: inherit; color: rgb(69, 26, 3);\">&nbsp;</strong><strong style=\"background-color: inherit; color: rgb(77, 124, 15);\">&nbsp;</strong><strong style=\"background-color: inherit;\">⬇️</strong></p>",
            "id": "sg8S8R",
            "name": "21yZta"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_IZ8q8K",
            "cols": "grid-cols-2",
            "orientation": "vertical",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "5MtKJj",
                "image": {
                  "type": "image",
                  "src": "./assets/images/idade-recem-nascido.jpg",
                  "width": 1344,
                  "height": 768
                },
                "label": "<p>Recém-nascido</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "B8KNGb",
                "image": {
                  "type": "image",
                  "src": "./assets/images/idade-ate-1-ano.jpg",
                  "width": 1344,
                  "height": 768
                },
                "label": "<p>Até 1 ano</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "AfgST0",
                "label": "<p>1 a 2 anos</p>",
                "chosen": false,
                "selected": false,
                "image": {
                  "type": "image",
                  "src": "./assets/images/idade-1-a-2-anos.jpg",
                  "width": 1344,
                  "height": 768
                }
              },
              {
                "id": "8w4DD9",
                "label": "<p>Acima de 2 anos</p>",
                "chosen": false,
                "selected": false,
                "image": {
                  "type": "image",
                  "src": "./assets/images/idade-acima-de-2.jpg",
                  "width": 1344,
                  "height": 768
                }
              }
            ],
            "id": "AbET9p"
          }
        }
      ]
    },
    {
      "id": "ZwyvHH",
      "title": "Prova social",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\"><strong style=\"color: rgb(69, 26, 3);\">Mais de 15.000 mães em 10 países diferentes</strong></h1><p class=\"ql-align-center\"><strong>Escolheram o  Como Fazer Seu Filho Dormir</strong></p><p class=\"ql-align-center\"><strong>Avaliação 4,9 de avaliação (</strong><span style=\"color: rgb(51, 51, 51);\">⭐⭐⭐⭐⭐)</span></p><p class=\"ql-align-center\"><br></p>",
            "id": "GPbmt3",
            "name": "qtqwXC"
          }
        },
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/prova-social.jpg",
              "type": "image",
              "width": 1344,
              "height": 768
            },
            "id": "rErkdq",
            "name": "dSlpoP"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "KfmlcN",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "Dtu4Ry"
          }
        }
      ]
    },
    {
      "id": "5PebRA",
      "title": "Etapa 2",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Qual é a rotina de sono atual do seu filho?</h1><p class=\"ql-align-center\">Selecione uma opção para avançar</p><p class=\"ql-align-center\"><br></p>",
            "id": "xzGe0r",
            "name": "fqHKwv"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_xQfnjC",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "sPY1PJ",
                "image": {
                  "type": "emoji",
                  "src": "🕒"
                },
                "label": "<p>Sem rotina definida</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "PZXCiq",
                "image": {
                  "type": "emoji",
                  "src": "📅"
                },
                "label": "<p>Tem uma rotina leve</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "0Rl4qk",
                "label": "<p>Segue uma rotina rigorosa</p>",
                "image": {
                  "type": "emoji",
                  "src": "📏"
                }
              },
              {
                "id": "q0Vvrf",
                "label": "<p>Tentei várias abordagens, mas sem sucesso</p>",
                "image": {
                  "type": "emoji",
                  "src": "😩"
                }
              }
            ],
            "id": "SW5NBw"
          }
        }
      ]
    },
    {
      "id": "WKqSsR",
      "title": "Etapa 3",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "aKxed6",
            "name": "zvqQKn",
            "text": "<h1 class=\"ql-align-center\">Você já tentou alguma técnica para ajudar seu filho a dormir?</h1><p class=\"ql-align-center\">Selecione uma opção para avançar</p>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "zurK49",
            "name": "opcoes_n8xkVs",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "hN095F",
                "image": {
                  "type": "emoji",
                  "src": "🛏️"
                },
                "label": "Sim, já tentei algumas.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "eyl8hr",
                "image": {
                  "type": "emoji",
                  "src": "❌"
                },
                "label": "Não, nunca tentei.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "HKP8ti",
                "image": {
                  "type": "emoji",
                  "src": "🤔"
                },
                "label": "Estou pensando em tentar.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "eZgW5s",
                "image": {
                  "type": "emoji",
                  "src": "😴"
                },
                "label": "<p>Não sei por onde começar.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ]
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "id": "hJGTL6",
            "name": "KdsD3F",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false
          }
        }
      ]
    },
    {
      "id": "UWfarU",
      "title": "Etapa 4 - Propaganda",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\"><strong style=\"color: rgb(9, 9, 11);\">A </strong><strong style=\"color: rgb(37, 99, 235);\">Rotina de Sono</strong><strong style=\"color: rgb(9, 9, 11);\"> é fundamental para a </strong><strong style=\"color: rgb(37, 99, 235);\">saúde do bebê</strong><strong style=\"color: rgb(9, 9, 11);\">.</strong></h1><p class=\"ql-align-center\"><strong style=\"background-color: inherit;\">Vamos criar um plano prático para você&nbsp;<u>aplicar HOJE MESMO!</u></strong></p><p class=\"ql-align-center\"><span style=\"background-color: inherit;\">Continue preenchendo para gerar seu&nbsp;</span><strong style=\"background-color: inherit;\">plano de ação</strong><span style=\"background-color: inherit;\">&nbsp;e fazer seu filho dormir a noite inteira.</span></p>",
            "id": "aTFOtR",
            "name": "8rlvyb"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100
          },
          "content": {
            "name": "wbIsOu",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "Ja3uRy"
          }
        },
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/antes-depois.png",
              "type": "image",
              "width": 1080,
              "height": 1080
            },
            "id": "bGRW2j",
            "name": "iq85lo"
          }
        }
      ]
    },
    {
      "id": "JZiaNT",
      "title": "Etapa 5",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "GeAQGK",
            "name": "lwHp70",
            "text": "<h1 class=\"ql-align-center\">Rotina de Sono</h1><p class=\"ql-align-center\">Você possui uma rotina de sono estabelecida para seu filho?</p>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "PXfSgp",
            "name": "opcoes_s8pRI0",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "cmbGcp",
                "image": {
                  "type": "emoji",
                  "src": "✅"
                },
                "label": "Sim, sigo uma rotina.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "uUEPf2",
                "image": {
                  "type": "emoji",
                  "src": "🔄"
                },
                "label": "<p>Às vezes, varia.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "K6cfYl",
                "image": {
                  "type": "emoji",
                  "src": "❌"
                },
                "label": "<p>Não, não tenho uma.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "GXCiEY",
                "image": {
                  "type": "emoji",
                  "src": "🤷"
                },
                "label": "<p>Não sei como criar uma.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ],
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "id": "o4EeFg",
            "name": "Cke4EZ",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false
          }
        }
      ]
    },
    {
      "id": "k5lUi7",
      "title": "Etapa 6",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Seu filho tem dificuldade para adormecer?</h1><p class=\"ql-align-center\">Selecione uma opção para avançar</p><p class=\"ql-align-center\"><br></p>",
            "id": "cPl3Qy",
            "name": "5lcUMQ"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_MMmP10",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "pX2E6f",
                "image": {
                  "type": "emoji",
                  "src": "😞"
                },
                "label": "<p>Sim, muito</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "rhfEJm",
                "image": {
                  "type": "emoji",
                  "src": "😅"
                },
                "label": "<p>Às vezes\t</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "yz1ufi",
                "label": "<p>Raramente</p>",
                "image": {
                  "type": "emoji",
                  "src": "🤔"
                },
                "chosen": false,
                "selected": false
              },
              {
                "id": "QCgZly",
                "label": "<p>Nunca</p>",
                "image": {
                  "type": "emoji",
                  "src": "💤"
                },
                "chosen": false,
                "selected": false
              }
            ],
            "id": "zV5YI8",
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "uOiJyD",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "UppEWh"
          }
        }
      ]
    },
    {
      "id": "mHorMU",
      "title": "Etapa 6.1",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Seu filho se recusa a ir para a cama?</h1>",
            "id": "70AVrK",
            "name": "V8XOzF"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_gSBPlN",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "5s2CrW",
                "image": {
                  "type": "emoji",
                  "src": "😩"
                },
                "label": "<p>Sim, sempre</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "T3xFCI",
                "image": {
                  "type": "emoji",
                  "src": "😬"
                },
                "label": "<p>Às vezes</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "ddfcd0",
                "label": "<p>Raramente</p>",
                "image": {
                  "type": "emoji",
                  "src": "🙏"
                },
                "chosen": false,
                "selected": false
              },
              {
                "id": "2j3HV2",
                "label": "<p>Nunca</p>",
                "image": {
                  "type": "emoji",
                  "src": "😴"
                },
                "chosen": false,
                "selected": false
              }
            ],
            "id": "G8zVWD",
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "SbOHdM",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "xRG5jG"
          }
        }
      ]
    },
    {
      "id": "3zCKsy",
      "title": "Etapa 7",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Em qual ambiente seu filho dorme?</h1><p class=\"ql-align-center\">Selecione uma opção para avançar</p>",
            "id": "7EU3ux",
            "name": "2tW2ya"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_yR0lvQ",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "6CyCPn",
                "image": {
                  "type": "emoji",
                  "src": "🏠"
                },
                "label": "<p>No meu quarto</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "MRKQIb",
                "image": {
                  "type": "emoji",
                  "src": "🛏"
                },
                "label": "<p>Em seu próprio quarto</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "INb3jx",
                "label": "<p>Na sala</p>",
                "image": {
                  "type": "emoji",
                  "src": "👪"
                },
                "chosen": false,
                "selected": false
              },
              {
                "id": "4hEJlO",
                "label": "<p>No carro</p>",
                "image": {
                  "type": "emoji",
                  "src": "🚗"
                },
                "chosen": false,
                "selected": false
              }
            ],
            "id": "5Vo2z1",
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "XDzd5s",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "T8kjBI"
          }
        }
      ]
    },
    {
      "id": "2LV8Qy",
      "title": "Etapa 8",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "yyZFnP",
            "name": "qgnPRo",
            "text": "<h1 class=\"ql-align-center\">Ambiente de Sono</h1><p class=\"ql-align-center\">Como você descreveria o ambiente de sono do seu filho?</p>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "vWBKAb",
            "name": "opcoes_EbAE1s",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "PuaY6q",
                "image": {
                  "type": "emoji",
                  "src": "🛌"
                },
                "label": "Tranquilo e confortável.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "PrfxM3",
                "image": {
                  "type": "emoji",
                  "src": "😟"
                },
                "label": "Cheio de distrações.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "UDXlUQ",
                "image": {
                  "type": "emoji",
                  "src": "🌬️"
                },
                "label": "<p>Com ventilação adequada.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "3S09n3",
                "image": {
                  "type": "emoji",
                  "src": "🕯️"
                },
                "label": "<p>Com iluminação suave.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ],
            "awaitSubmit": true,
            "multiple": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "id": "28j1dl",
            "name": "3VPAMv",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false
          }
        }
      ]
    },
    {
      "id": "YHUWzL",
      "title": "Etapa 9",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "bO9pyK",
            "name": "WLMiXN",
            "text": "<h1 class=\"ql-align-center\">Técnicas de Relaxamento</h1><p class=\"ql-align-center\">Qual dessas técnicas de relaxamento você já utilizou?</p>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "PSEoQ6",
            "name": "opcoes_nwwJCq",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "Nl7tsx",
                "image": {
                  "type": "emoji",
                  "src": "🎶"
                },
                "label": "Música suave",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "zumoXL",
                "image": {
                  "type": "emoji",
                  "src": "🌙"
                },
                "label": "<p>Luz baixa</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "twjwlS",
                "image": {
                  "type": "emoji",
                  "src": "📖"
                },
                "label": "<p>Leitura de histórias</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "Stku3K",
                "image": {
                  "type": "emoji",
                  "src": "🛁"
                },
                "label": "<p>Banho quente</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ],
            "multiple": true,
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "NhApCu",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "qZPtDa"
          }
        }
      ]
    },
    {
      "id": "4CMUXK",
      "title": "Etapa 10",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Como você costuma ajudar seu filho a dormir?</h1><p class=\"ql-align-center\">Selecione uma opção para avançar</p>",
            "id": "Ax0xTh",
            "name": "ZtqjFA"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_IOdw5p",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "gwqp96",
                "image": {
                  "type": "emoji",
                  "src": "📖"
                },
                "label": "<p>Contando histórias</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "AurY5m",
                "image": {
                  "type": "emoji",
                  "src": "🎶"
                },
                "label": "<p>Colocando música suave</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "LU4GcC",
                "label": "<p>Amamentando</p>",
                "image": {
                  "type": "emoji",
                  "src": "🤱"
                },
                "chosen": false,
                "selected": false
              },
              {
                "id": "THBuTI",
                "label": "<p>Deixando a luz acesa</p>",
                "image": {
                  "type": "emoji",
                  "src": "💡"
                },
                "chosen": false,
                "selected": false
              }
            ],
            "id": "JKI3r4",
            "multiple": true,
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "xv07Ty",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "9j2iKb"
          }
        }
      ]
    },
    {
      "id": "cUj3Tz",
      "title": "Etapa 11",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Você utiliza alguma tecnologia para ajudar seu filho a dormir?</h1>",
            "id": "CG5lKp",
            "name": "GvS6Xz"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_sT1Tml",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "vwADSV",
                "image": {
                  "type": "emoji",
                  "src": "📱"
                },
                "label": "<p>Sim, uso aplicativos</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "3f8Zas",
                "image": {
                  "type": "emoji",
                  "src": "🔊"
                },
                "label": "<p>Sim, uso sons relaxantes</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "19FNup",
                "label": "<p>Não, prefiro métodos tradicionais</p>",
                "chosen": false,
                "selected": false,
                "image": {
                  "type": "emoji",
                  "src": "❌"
                }
              }
            ],
            "id": "NIkYWo",
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "MG9F5w",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "WkoLhZ"
          }
        }
      ]
    },
    {
      "id": "KifK8e",
      "title": "Etapa 12",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "7JInrW",
            "name": "xgkHVH",
            "text": "<h1 class=\"ql-align-center\">Você acha que a alimentação do seu filho afeta o sono dele?</h1>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "73pJ1W",
            "name": "opcoes_kyL6MR",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "vHCm5K",
                "image": {
                  "type": "emoji",
                  "src": "🍽️"
                },
                "label": "Sim, com certeza!",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "nCaE1F",
                "image": {
                  "type": "emoji",
                  "src": "🤔"
                },
                "label": "Talvez, não tenho certeza.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "Trhcfy",
                "image": {
                  "type": "emoji",
                  "src": "❌"
                },
                "label": "Não, não acho.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "NEALt0",
                "image": {
                  "type": "emoji",
                  "src": "🍭"
                },
                "label": "<p>Não me atentei a isso.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ],
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "id": "bekJCm",
            "name": "ntKJ1U",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false
          }
        }
      ]
    },
    {
      "id": "mCUKD7",
      "title": "Etapa 13",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "id": "OfLB4p",
            "name": "LWnSi2",
            "text": "<h1 class=\"ql-align-center\">Seu filho usa dispositivos eletrônicos antes de dormir?</h1>"
          }
        },
        {
          "type": "options",
          "design": {},
          "content": {
            "id": "vgqMcY",
            "name": "opcoes_PxhDOa",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "DAokL5",
                "image": {
                  "type": "emoji",
                  "src": "📱"
                },
                "label": "Sim, frequentemente.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "bsDCDP",
                "image": {
                  "type": "emoji",
                  "src": "📵"
                },
                "label": "Não, evito isso.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "JWLKMr",
                "image": {
                  "type": "emoji",
                  "src": "🔄"
                },
                "label": "Às vezes, depende do dia.",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "WfTj9z",
                "image": {
                  "type": "emoji",
                  "src": "🖥️"
                },
                "label": "<p>Só para jogos educativos.</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              }
            ],
            "awaitSubmit": true
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "id": "zqRjiy",
            "name": "nxeYap",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false
          }
        }
      ]
    },
    {
      "id": "EMIVfJ",
      "title": "Etapa 14 - Depoimentos",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Analisando seus dados e finalizando seu plano...</h1>",
            "id": "v6gR1s",
            "name": "IfcICw"
          }
        },
        {
          "type": "loading",
          "design": {
            "style": "default",
            "basis": 100,
            "verticalAlign": "self-center",
            "horizontalAlign": "mx-auto"
          },
          "content": {
            "title": null,
            "name": "Upyj3X",
            "description": "<p class=\"ql-align-center\"><br></p>",
            "seconds": 5,
            "starts": 0,
            "destination": "next",
            "show_title": true,
            "show_percent": true,
            "show_progress": true,
            "id": "sEtiCo"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[2rem]",
            "id": "0Ivvgh",
            "name": "zj4zRj"
          }
        }
      ]
    },
    {
      "id": "jUX61V",
      "title": "Etapa 15",
      "layers": [
        {
          "type": "alert",
          "design": {
            "style": "warning",
            "basis": 100
          },
          "content": {
            "text": "<p><strong>Atenção</strong>: o nível ideal de <strong>rotina de sono</strong> do seu filho é a partir de 75%</p>",
            "id": "wX7BbO",
            "name": "yydO1l"
          }
        },
        {
          "type": "chart",
          "design": {
            "area": true,
            "axisY": true,
            "axisX": true,
            "basis": 100
          },
          "content": {
            "id": "XqZMgI",
            "title": null,
            "datas": [
              {
                "id": "jy3U0m",
                "legend": "0%",
                "value": 10,
                "tooltip": null,
                "chosen": false,
                "selected": false
              },
              {
                "id": "enRXmQ",
                "legend": "25%",
                "value": 30,
                "tooltip": "Você hoje",
                "featured": true,
                "chosen": false,
                "selected": false
              },
              {
                "id": "v4lkN8",
                "legend": "75%",
                "value": 75,
                "tooltip": "Ideal",
                "chosen": false,
                "selected": false
              },
              {
                "id": "MAEs6a",
                "text": null,
                "value": "100",
                "legend": "100%",
                "chosen": false,
                "selected": false
              }
            ],
            "name": "JHHjjZ"
          }
        },
        {
          "type": "alert",
          "design": {
            "style": "danger"
          },
          "content": {
            "text": "<p>⭕&nbsp;<strong>Falta de rotina de sono:</strong></p><p>A falta de rotina de sono em um bebê pode ter consequências negativas para a mãe, o casal e todo o lar. </p>",
            "id": "goeEhP",
            "name": "1D7VP2"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "5C2XlM",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "7azuGR"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p class=\"ql-align-center\">Analise os <strong>motivos que mais atrapalham</strong> a rotina do sono</p>",
            "id": "wkCKXI",
            "name": "MIdCkQ"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_YUVEjL",
            "cols": "grid-cols-2",
            "orientation": "vertical",
            "order": "default",
            "required": false,
            "options": [
              {
                "id": "vl3Z0d",
                "image": {
                  "type": "emoji",
                  "src": "🍼"
                },
                "label": "<p class=\"ql-align-center\"><strong style=\"color: rgb(9, 9, 11); background-color: rgba(234, 236, 240, 0.08);\">Alimentações frequentes</strong></p><p class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Bebês precisam se alimentar em intervalos curtos, tornando difícil estabilizar o sono.</span></p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "f3oW6k",
                "image": {
                  "type": "emoji",
                  "src": "👶"
                },
                "label": "<p class=\"ql-align-center\"><strong style=\"color: rgb(9, 9, 11);\">Acordar Frequentes</strong></p><p class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Bebês podem acordar várias vezes à noite, seja para se alimentar ou mudar a fralda, desorganizando a rotina de sono.</span></p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "ckv7v8",
                "label": "<p class=\"ql-align-center\"><strong style=\"color: rgb(9, 9, 11);\">Picos de desenvolvimento</strong></p><p class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Bebês podem passar por fases de desenvolvimento, como dentição ou espirros, que podem interromper o sono.</span></p>",
                "chosen": false,
                "selected": false,
                "image": {
                  "type": "emoji",
                  "src": "📈"
                }
              },
              {
                "id": "PmF77G",
                "label": "<p><strong>Mudanças no ambiente</strong></p><p>Viagens, mudanças de residentes ou mudanças no ambiente do bebê podem fazer com que ele se adapte mal ao novo ambiente e perca o sono.﻿</p>",
                "chosen": false,
                "selected": false,
                "image": {
                  "type": "emoji",
                  "src": "🚗"
                }
              }
            ],
            "id": "jOp7Ey"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "rDpvDO",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "iT82Gt"
          }
        }
      ]
    },
    {
      "id": "RnzMZh",
      "title": "Etapa 16",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Você tem&nbsp;<span style=\"color: rgb(37, 99, 235);\">quantos minutos por dia livre</span>&nbsp;para estudar sobre sono?</h1><p class=\"ql-align-center\">O plano de sono é feito para você conseguir realizar em casa.</p>",
            "id": "jkeyhU",
            "name": "YwmM43"
          }
        },
        {
          "type": "options",
          "design": {
            "transparentImage": true
          },
          "content": {
            "name": "opcoes_vBEuJT",
            "cols": "grid-cols-1",
            "orientation": "horizontal",
            "order": "default",
            "required": true,
            "options": [
              {
                "id": "LpjmGQ",
                "image": {
                  "type": "emoji",
                  "src": "🙂"
                },
                "label": "<p>10 - 15 minutos (mínimo recomendado)</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "h2apVF",
                "image": {
                  "type": "emoji",
                  "src": "😃"
                },
                "label": "<p>15 - 30 minutos</p>",
                "destination": "next",
                "chosen": false,
                "selected": false
              },
              {
                "id": "xn2p0E",
                "label": "<p>+30 minutos</p>",
                "image": {
                  "type": "emoji",
                  "src": "😍"
                },
                "chosen": false,
                "selected": false
              }
            ],
            "id": "Msj07v"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "GzWXiU",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "yDaGPd"
          }
        }
      ]
    },
    {
      "id": "lkoqLb",
      "title": "Etapa 17",
      "layers": [
        {
          "type": "loading",
          "design": {
            "style": "default"
          },
          "content": {
            "title": "Carregando...",
            "name": "KDYlM7",
            "description": "<p class=\"ql-align-center\"><br></p>",
            "seconds": 6,
            "starts": 0,
            "destination": "next",
            "show_title": true,
            "show_percent": true,
            "show_progress": true,
            "id": "RZuzom"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h3 class=\"ql-align-center\"><span style=\"color: rgb(220, 38, 38);\">Criando seu plano de sono...</span></h3>",
            "id": "wn13Yr",
            "name": "xKBecd"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[3rem]",
            "id": "z4EisZ",
            "name": "yPk4W2"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Enquanto isso, conheça a <span style=\"color: rgb(37, 99, 235);\">idealizadora</span> do Como Fazer Seu Filho Dormir</h1>",
            "id": "5uFppW",
            "name": "1yZiJ1"
          }
        },
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/samia-marsili.jpg",
              "type": "image",
              "width": 1170,
              "height": 811
            },
            "id": "jqlgp4",
            "name": "RTAGAE"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p>Oi, tudo bem? Sou a <strong>Samia Marsili,</strong>&nbsp;médica, mãe de sete filhos e uma menina, criadora da CSM, que já ajudou mais de 25 mil mães em todo o Brasil e o mundo.</p><p>Minha maior missão é ajudar mães em todas as fases da maternidade: gestação, puerpério,&nbsp;<strong>sono</strong>, amamentação, criação de filhos, alimentação e educação.&nbsp;</p><p>Será um prazer te ajudar. Conte comigo!</p>",
            "id": "jIgqWh",
            "name": "JcuTZH"
          }
        }
      ]
    },
    {
      "id": "uzEBCp",
      "title": "Etapa 18",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Montamos um plano incrível para você.</h1><p>Quando se trata de sono, o quanto antes agir, melhor. E com base no resultado das nossas alunas, esperamos que em até 7 dias você já note uma rotina de sono muito bem estabelecida.</p><p><strong>E o melhor de tudo:</strong>&nbsp;de forma simples e eficiente.</p>",
            "id": "UEZRHh",
            "name": "Lykeqb"
          }
        },
        {
          "type": "chart",
          "design": {
            "area": true,
            "axisY": true,
            "axisX": true
          },
          "content": {
            "id": "CgzKTh",
            "title": null,
            "datas": [
              {
                "id": "jy3U0m",
                "legend": "Sem rotina",
                "value": 10,
                "tooltip": null,
                "chosen": false,
                "selected": false
              },
              {
                "id": "enRXmQ",
                "legend": "Começando a rotina",
                "value": 30,
                "tooltip": "Você hoje",
                "featured": true,
                "chosen": false,
                "selected": false
              },
              {
                "id": "v4lkN8",
                "legend": "Rotina estabelecida",
                "value": 75,
                "tooltip": "Você daqui a 7 dias",
                "chosen": false,
                "selected": false
              },
              {
                "id": "KlxbSe",
                "text": null,
                "legend": "Ideal",
                "value": "100",
                "chosen": false,
                "selected": false
              }
            ],
            "name": "4ACn6u"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p>Imagem meramente ilustrativa*</p>",
            "id": "NGlHp9",
            "name": "B4xc2i"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme"
          },
          "content": {
            "name": "i4Wa7M",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "9IPR8I"
          }
        }
      ]
    },
    {
      "id": "W81djF",
      "title": "Etapa 19 - Depoimentos",
      "layers": [
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Relatos de mães que aplicaram o  Como Fazer Seu Filho Dormir.</h1>",
            "id": "z1um1u",
            "name": "NRvGp7"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p class=\"ql-align-center\">Milhares de mães tiveram resultado com a ajuda do método.</p>",
            "id": "QNON1O",
            "name": "VujBMg"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100,
            "pulse": true
          },
          "content": {
            "name": "TgyTFh",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "ii1KWm"
          }
        },
        {
          "type": "quotes",
          "design": {},
          "content": {
            "quotes": [
              {
                "id": "UM9jvq",
                "text": "Que material necessário! minha bebê tinha autonomia e, após o início do terrible two, acabei introduzindo algumas associações.. graças ao seu conteúdo estou retirando uma por uma!",
                "activity": null,
                "name": "Jahyne Serraglio Piccolo",
                "rate": 5,
                "chosen": false,
                "selected": false
              },
              {
                "id": "IMiTOJ",
                "text": "Gostaria de dizer que fiz a técnica com meu filho de 3 anos, retirei a associação de presença e ele dorme lindamente sozinho! Com minha bebê, segui a risca tudo, e ela dorme 12 horas seguidas!!! Tudo isso combinado com muita oração e pedido de sabedoria a Deus para me instruir na caminhada!! Obrigada, vocês são necessárias 🥹🙌👍\nEu já havia feito outros cursos e não consegui êxito, aprendi muito mas não conseguia executar, aqui eu me achei 🙏🙏🙏",
                "activity": null,
                "name": "Leandra Lake",
                "rate": 5,
                "chosen": false,
                "selected": false
              },
              {
                "id": "mVbg9M",
                "text": "Gostei muito do conteúdo, esclareceu muitas dúvidas, pois meu filho tem episódios de terror noturno. Muito obrigada.",
                "activity": null,
                "name": "Anelise Rodolfo Ferreira Pieralini",
                "rate": 5,
                "chosen": false,
                "selected": false
              },
              {
                "id": "gFYY33",
                "text": "Meu filho estava toda noite chorando para dormir, fiz o ajuste na rotina de sono e não teve choro, ficou no quarto dele. Usava um ponto de luz no corredor, mudei e coloquei no quarto dele.\nFiquei refletindo como os conteúdos nos ajudam no nosso dia a dia, se todos pudessem ter a consciência e fazer parte, algumas “lutas” passaria seria vencida tranquilamente.",
                "activity": null,
                "name": "Laisa da Silva Rodrigues",
                "rate": 5,
                "chosen": false,
                "selected": false
              }
            ],
            "id": "LUvxph",
            "name": "2spTVM"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p class=\"ql-align-center\"><strong>Temos milhares de relatos como esses, mas ficaria grande demais colocar tudo aqui</strong></p>",
            "id": "cjIn1P",
            "name": "1bJyFL"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100,
            "pulse": true
          },
          "content": {
            "name": "XO4YcB",
            "type": "next",
            "label": "Continuar",
            "destination": "next",
            "pulse": false,
            "target": false,
            "id": "tVcntN"
          }
        }
      ]
    },
    {
      "id": "m4IAL6",
      "title": "Etapa 20",
      "layers": [
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/antes-depois.png",
              "type": "image",
              "width": 1080,
              "height": 1080
            },
            "id": "faifbr",
            "name": "sY34yu"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h2 class=\"ql-align-center\">O seu plano personalizado para fazer seu filho dormir está pronto!</h2>",
            "id": "Ldt5pY",
            "name": "xASshC"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p class=\"ql-align-center\">Veja os <strong>benefícios</strong> para o seu <strong>bebê</strong>:</p>",
            "id": "zbaa7V",
            "name": "NPX6tB"
          }
        },
        {
          "type": "arguments",
          "design": {},
          "content": {
            "cols": "grid-cols-2",
            "order": "default",
            "arguments": [
              {
                "id": "j4BIyI",
                "text": "<h3 class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Antes do Plano Como Fazer Seu Filho Dormir</span></h3><p><span style=\"color: rgb(9, 9, 11);\">🔴&nbsp;Problemas de sono crônicos</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴&nbsp;Alterações no Comportamento</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴&nbsp;Aumento da Ansiedade</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴 Cognição Afetada</span></p><p class=\"ql-align-center\"><br></p>",
                "chosen": false,
                "selected": false
              },
              {
                "id": "N1Iixz",
                "text": "<h3 class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Depois do Plano Como Fazer Seu Filho Dormir</span></h3><p><span style=\"color: rgb(9, 9, 11);\">✅&nbsp;Ciclo circadiano regulado</span></p><p><span style=\"color: rgb(9, 9, 11);\">✅ Mais fácil de lidar</span></p><p><span style=\"color: rgb(9, 9, 11);\">✅ Melhor memória e aprendizado</span></p><p><span style=\"color: rgb(9, 9, 11);\">✅ Menos sucetível a doenças</span></p>",
                "chosen": false,
                "selected": false
              }
            ],
            "id": "40lsRN",
            "name": "xRzk1P"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p class=\"ql-align-center\">Veja os <strong>benefícios</strong> para você, <strong>mãe</strong>:</p>",
            "id": "uAYI3i",
            "name": "2XuRts"
          }
        },
        {
          "type": "arguments",
          "design": {},
          "content": {
            "cols": "grid-cols-2",
            "order": "default",
            "arguments": [
              {
                "id": "pcTiSz",
                "text": "<h3 class=\"ql-align-center\">Antes do Plano Como Fazer Seu Filho <span style=\"color: rgb(9, 9, 11);\">Dormir</span></h3><p><span style=\"color: rgb(9, 9, 11);\">🔴 Estressada e Ansiosa&nbsp;</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴 Desorganizada</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴 Dificuldade de estabelecer relação com o bebê</span></p><p><span style=\"color: rgb(9, 9, 11);\">🔴 Maior risco de doenças</span></p><p class=\"ql-align-center\"><br></p>",
                "chosen": false,
                "selected": false
              },
              {
                "id": "U7GLYM",
                "text": "<h3 class=\"ql-align-center\">Depois do Plano Como Fazer Seu Filho Dormir</h3><p>✅ Menos estresse e ansiedade</p><p>✅ Melhor gerenciamento da rotina</p><p>✅ Melhor relacionamento com marido</p><p>✅ Redução do ganho de peso</p>",
                "chosen": false,
                "selected": false
              }
            ],
            "id": "XPooES",
            "name": "qdr5PD"
          }
        },
        {
          "type": "price",
          "design": {
            "style": "theme",
            "basis": 100
          },
          "content": {
            "title": "<p><strong>Pagamento único: acesso 12 meses</strong></p>",
            "value": "R$ 39,90",
            "before": "De R$ 197 por",
            "after": "à vista",
            "redirect": true,
            "id": "wOxhLS",
            "name": "iHYx73",
            "featured": "SUPER DESCONTO DO MÊS"
          }
        },
        {
          "type": "timer",
          "design": {
            "style": "danger"
          },
          "content": {
            "text": "<p class=\"ql-align-center\">Aproveite a oferta especial: [time]</p>",
            "time": "120",
            "id": "kvQaLo",
            "name": "KRF0qJ"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100,
            "pulse": true
          },
          "content": {
            "name": "JhHrq8",
            "type": "redirect",
            "label": "QUERO MEU PLANO PERSONALIZADO AGORA",
            "destination": "https://pay.hotmart.com/X71620859G?off=ya5dy8cq&checkoutMode=10&src=quizz1botao&sck=quizz1botao",
            "pulse": false,
            "target": true,
            "id": "MbDJX9"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[2rem]",
            "id": "djmUfr",
            "name": "WUgFL7"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\"><span style=\"color: rgb(9, 9, 11);\">Veja tudo o que você vai receber</span></h1><h3><br></h3><h3><span style=\"color: rgb(9, 9, 11);\">📚 Plano Prático </span><strong style=\"color: rgb(9, 9, 11);\">Como Fazer Seu Filho Dormir</strong></h3><h3><br></h3><h3><strong>✅ Tabela do sono</strong></h3><p><span style=\"color: rgb(9, 9, 11);\">Uma tabela para que você saiba o que fazer de acordo com a idade do seu filho(a)</span></p><h3 class=\"ql-align-center\"><br></h3><h3><strong>✅&nbsp;</strong><strong style=\"color: rgb(9, 9, 11);\">Treinamento do sono</strong></h3><p><span style=\"color: var(--contentPrimaryColor,#171717);\">Passo a passo de ações para fazer seu filho dormir</span></p><p class=\"ql-align-center\"><br></p><h3><strong>✅&nbsp;</strong><strong style=\"color: rgb(9, 9, 11);\">Redução do estresse e das preocupações</strong></h3><h3><br></h3><p class=\"ql-align-center\"><br></p><h3><strong>✅&nbsp;</strong><strong style=\"color: rgb(9, 9, 11);\">Melhora do sono</strong></h3><h3><strong style=\"color: var(--contentPrimaryColor,#171717);\">e melhor qualidade de descanso</strong></h3><p><span style=\"color: rgb(9, 9, 11);\">do seu bebê e de você.</span></p><h3><br></h3><h3><strong>✅&nbsp;Tempo de acesso: 12 meses</strong></h3><h3><br></h3><h3><br></h3><h3><br></h3><h3><strong style=\"color: rgb(9, 9, 11);\">🎁 EXTRA:</strong><span style=\"color: rgb(9, 9, 11);\">&nbsp;Aulão Como Fazer Seu Filho Dormir</span></h3>",
            "id": "RmMcr4",
            "name": "pZCeoy"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[2rem]",
            "id": "7gtCA4",
            "name": "p7hKyn"
          }
        },
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/mockup.png",
              "type": "image",
              "width": 1800,
              "height": 1013
            },
            "id": "nV3K4K",
            "name": "yi6AmK"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Experimente primeiro e decida depois</h1><p class=\"ql-align-center\">Você tem 7 dias de garantia para experimentar o <strong>Plano Prático Como Fazer seu Filho Dormir</strong>. Se por algum motivo você achar que ele não é ideal para você, então basta pedir o reembolso dentro do prazo de 7 dias e seu investimento será devolvido.</p><p class=\"ql-align-center\"><br></p>",
            "id": "h748oX",
            "name": "8faPNd"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[3rem]",
            "id": "NHBEKZ",
            "name": "y5RJpC"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h2 class=\"ql-align-center\">Com 15-20 minutos por dia você já consegue mudar a rotina de sono do seu bebê</h2><p class=\"ql-align-center\">E assim, diminuir o estresse, ansiedade, noites mal dormidas e melhorar sua saúde, relacionamento com o marido e com o seu bebê</p><p class=\"ql-align-center\"><br></p>",
            "id": "OrYwx0",
            "name": "wUwdgN"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h3 class=\"ql-align-center\">Este plano oferece ferramentas para:</h3><p class=\"ql-align-center\"><br></p><p>✅ Entender completamente como funciona o sono do seu bebê</p><p>✅ Aplicar métodos para estabelecer a rotina de sono</p><p>✅ Parar de ter noites mal dormidas</p>",
            "id": "6W0x4x",
            "name": "R4WIeC"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[3rem]",
            "id": "OwKPsU",
            "name": "E0Gih1"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h2 class=\"ql-align-center\">Adquira agora seu plano</h2>",
            "id": "1t2XhJ",
            "name": "VG6y9D"
          }
        },
        {
          "type": "price",
          "design": {
            "style": "theme",
            "basis": 100
          },
          "content": {
            "title": "<p><strong>Pagamento único: acesso 12 meses</strong></p>",
            "value": "R$ 39,90",
            "before": "De R$ 197 por",
            "after": "à vista",
            "redirect": true,
            "id": "iQUMEp",
            "name": "KbhQeo",
            "featured": "SUPER DESCONTO DO MÊS"
          }
        },
        {
          "type": "timer",
          "design": {
            "style": "danger"
          },
          "content": {
            "text": "<p class=\"ql-align-center\">Aproveite a oferta especial: [time]</p>",
            "time": "120",
            "id": "BujT7U",
            "name": "ADIcPW"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100,
            "pulse": true
          },
          "content": {
            "name": "9cUu5s",
            "type": "redirect",
            "label": "QUERO MEU PLANO PERSONALIZADO AGORA",
            "destination": "https://pay.hotmart.com/X71620859G?off=ya5dy8cq&checkoutMode=10&src=quizz2botao&sck=quizz2botao",
            "pulse": false,
            "target": true,
            "id": "7zyq7J"
          }
        },
        {
          "type": "clear",
          "design": {},
          "content": {
            "clear": "h-[2rem]",
            "id": "JLxugQ",
            "name": "cW5DUw"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<h1 class=\"ql-align-center\">Quem será sua professora?</h1>",
            "id": "AgSXmT",
            "name": "wEJ6Zz"
          }
        },
        {
          "type": "image",
          "design": {},
          "content": {
            "image": {
              "src": "./assets/images/samia-marsili.jpg",
              "type": "image",
              "width": 1170,
              "height": 811
            },
            "id": "zmMXeT",
            "name": "u1F0MV"
          }
        },
        {
          "type": "text",
          "design": {},
          "content": {
            "text": "<p><span style=\"color: rgb(0, 0, 0); background-color: transparent;\">Samia Marsili é médica e fundadora da Comunidade Samia Marsili, a maior comunidade para mães do Brasil.</span></p><p><span style=\"color: rgb(0, 0, 0); background-color: transparent;\">Há mais de 15 anos dedica sua vida para ajudar famílias a criarem filhos com valores sólidos, amor e propósito.</span></p><p><span style=\"color: rgb(74, 50, 63); background-color: transparent;\">Ela distribui conteúdos gratuitos sobre o assunto para mais de 1 milhão de famílias todos os dias, além de aulas sobre assuntos como sono, educação infantil e vício em telas para mais de 101 mil alunos.</span></p><p><span style=\"color: rgb(74, 50, 63); background-color: transparent;\">E agora vai te explicar tudo que você precisa para mudar completamente a rotina de sono do seu bebê para te deixar menos estressada, ansiosa e melhorar o relacionamento com seu marido, filho e organização do lar.</span></p><p class=\"ql-align-center\"><br></p>",
            "id": "8gqBzu",
            "name": "o9JKe8"
          }
        },
        {
          "type": "button",
          "design": {
            "style": "theme",
            "basis": 100,
            "pulse": true
          },
          "content": {
            "name": "EkAMQa",
            "type": "redirect",
            "label": "QUERO MEU PLANO PERSONALIZADO AGORA",
            "destination": "https://pay.hotmart.com/X71620859G?off=ya5dy8cq&checkoutMode=10&src=quizz2botao&sck=quizz2botao",
            "pulse": false,
            "target": true,
            "id": "GT9v8l"
          }
        }
      ]
    }
  ]
}
;