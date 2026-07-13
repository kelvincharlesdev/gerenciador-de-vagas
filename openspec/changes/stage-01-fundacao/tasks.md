## 1. Setup do Projeto

- [x] 1.1 Inicializar Next.js 16 com App Router usando `npx create-next-app@latest`
- [x] 1.2 Configurar Tailwind CSS v4 (postcss, tailwind.config, globals.css)
- [x] 1.3 Configurar ESLint + Prettier + editorconfig
- [x] 1.4 Instalar plugins de segurança: `eslint-plugin-security` e `eslint-plugin-no-secrets`
- [x] 1.5 Configurar variáveis de ambiente (.env.local com Supabase, OpenRouter)
- [x] 1.6 Configurar layout global (navbar, footer, fontes)
- [x] 1.7 Configurar AGENTS.md com comandos do projeto e regras de segurança/LGPD

## 2. Supabase

> **Nota:** Tasks 2.1 e 2.2 são manuais (criar projeto no dashboard do Supabase e configurar provedores OAuth). As migrations SQL para 2.3–2.6 estão em `supabase/migrations/`.

- [ ] 2.1 Criar projeto Supabase (plano free) — **manual**
- [ ] 2.2 Configurar Auth (Google + GitHub + email providers) — **manual**
- [x] 2.3 Criar tabela `profiles` (id, name, email, avatar_url, created_at) — via migration `00001_profiles.sql`
- [x] 2.4 Configurar trigger SQL para criar profile ao registrar — via migration `00001_profiles.sql`
- [x] 2.5 Configurar Supabase Storage (bucket `curriculos` privado) — via migration `00002_storage.sql`
- [x] 2.6 Configurar Row Level Security (RLS) nas tabelas — via migrations `00001_profiles.sql` e `00002_storage.sql`

## 3. Autenticação

- [x] 3.1 Implementar tela /login com botões Google, GitHub, email/senha
- [x] 3.2 Configurar Supabase SSR client (client + server components)
- [x] 3.3 Implementar rota /auth/callback para OAuth
- [x] 3.4 Implementar middleware de proteção de rotas
- [x] 3.5 Implementar página de recuperação de senha
- [x] 3.6 Implementar botão de logout no navbar
- [x] 3.7 Criar hook `useUser` para acesso ao usuário logado

## 4. IA Client

- [x] 4.1 Configurar OpenRouter SDK (ou API compatível com OpenAI) — via fetch direto (compatível OpenAI)
- [x] 4.2 Criar serviço `ai-service.ts` com função `callAI(prompt, options)`
- [x] 4.3 Testar integração com Gemini Flash (modelo gratuito) — rota `GET /api/ai-test`

## 5. Deploy

> **Nota:** Tasks 5.1–5.3 são manuais (Vercel dashboard). As variáveis de ambiente necessárias estão em `.env.local.example`.

- [ ] 5.1 Conectar repositório à Vercel — **manual**
- [ ] 5.2 Configurar variáveis de ambiente na Vercel — **manual**
- [ ] 5.3 Fazer deploy inicial e validar — **manual**
- [x] 5.4 Rodar validadores: `node .opencode/skills/security-lgpd-review/validate.mjs && node .opencode/skills/code-quality-review/validate.mjs`
