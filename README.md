# Gerenciador de Vagas

SaaS que ajuda profissionais de TI a encontrar vagas compatíveis com seu perfil real. Um agente de IA especialista em RH entrevista o candidato, busca vagas em múltiplas fontes (LinkedIn, Gupy), calcula o match perfeito e ainda ajusta o currículo para cada vaga.

## Funcionalidades

- **Agente RH** — Entrevista com IA que extrai seu perfil real (senioridade, stack, preferências)
- **Busca Inteligente** — Vagas agregadas do LinkedIn e Gupy via vagas-dev
- **Match Perfil-Vaga** — Score de compatibilidade calculado em 5 dimensões
- **Análise de Currículo** — Upload de PDF + diagnóstico IA com scores por eixo ATS
- **Ajuste por Vaga** — Currículo reescrito e otimizado para a vaga escolhida

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | 24 LTS (Krypton) |
| Frontend | Next.js + React | 16 + 19 |
| Estilos | Tailwind CSS | v4 |
| Backend/Dados | Supabase (PostgreSQL + Auth + Storage) | v2 |
| IA | OpenRouter (Gemini Flash no MVP) | — |
| Motor de Vagas | [vagas-dev](https://github.com/henriquesebastiao/vagas-dev) (Gupy + LinkedIn) | — |
| Deploy | Vercel | — |

## Roadmap

```
□ STAGE 01 — Fundação     → Setup, auth, deploy
□ STAGE 02 — Busca        → Agente RH, vagas, match, dashboard
□ STAGE 03 — Currículo    → Análise e ajuste de currículo
```

## Desenvolvimento

```bash
npm run dev       # dev server
npm run build     # build production
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

## Projeto com IA

Todo o planejamento e implementação são guiados pelo OpenSpec. As changes ativas:

- `stage-01-fundacao` — Base do projeto + autenticação
- `stage-02-nucleo-busca` — Agente RH + vagas + match + dashboard
- `stage-03-curriculo` — Análise e ajuste de currículo

Validadores automáticos rodam após cada change para garantir segurança e qualidade do código.

## Licença

MIT
