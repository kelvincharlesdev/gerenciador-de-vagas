## Context

Primeira change do projeto. Precisamos estabelecer a fundação técnica: Next.js 14+ com App Router, Tailwind CSS v4, Supabase (Auth + PostgreSQL + Storage), integração com API de IA via OpenRouter, e deploy na Vercel.

## Goals / Non-Goals

**Goals:**
- Projeto Next.js rodando localmente e em produção
- Autenticação funcional com Google, GitHub e email
- Banco de dados PostgreSQL com RLS configurado
- Storage para upload de currículos
- Conexão com API de IA pronta para uso
- ESLint + Prettier configurados

**Non-Goals:**
- Nenhuma funcionalidade de negócio (perfil, vagas, currículo)
- UI além do básico (tela de login, layout vazio)

## Decisions

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Auth | Supabase Auth (SSR) | Já incluso, RLS nativo, grátis |
| ORM | Supabase JS client (raw SQL via migrations) | Evita camada extra no MVP |
| Storage | Supabase Storage (bucket privado) | Mesmo ecossistema, RLS |
| Deploy | Vercel | Free tier, integração Next.js nativa |
| IA Client | OpenRouter SDK (OpenAI-compatível) | Troca de modelo sem mudar código |

## Risks / Trade-offs

- Supabase free: 50k usuários, 500MB storage — suficiente para MVP
- Vercel free: 100 builds/dia, 10s timeout functions — limites confortáveis
