## 1. Setup do Projeto

- [ ] 1.1 Inicializar Next.js 14+ com App Router usando `create-next-app`
- [ ] 1.2 Configurar Tailwind CSS v4 (postcss, tailwind.config, globals.css)
- [ ] 1.3 Configurar ESLint + Prettier + editorconfig
- [ ] 1.4 Instalar plugins de segurança: `eslint-plugin-security` e `eslint-plugin-no-secrets`
- [ ] 1.5 Configurar variáveis de ambiente (.env.local com Supabase, OpenRouter)
- [ ] 1.6 Configurar layout global (navbar, footer, fontes)
- [ ] 1.7 Configurar AGENTS.md com comandos do projeto e regras de segurança/LGPD

## 2. Supabase

- [ ] 2.1 Criar projeto Supabase (plano free)
- [ ] 2.2 Configurar Auth (Google + GitHub + email providers)
- [ ] 2.3 Criar tabela `profiles` (id, name, email, avatar_url, created_at)
- [ ] 2.4 Configurar trigger SQL para criar profile ao registrar
- [ ] 2.5 Configurar Supabase Storage (bucket `curriculos` privado)
- [ ] 2.6 Configurar Row Level Security (RLS) nas tabelas

## 3. Autenticação

- [ ] 3.1 Implementar tela /login com botões Google, GitHub, email/senha
- [ ] 3.2 Configurar Supabase SSR client (client + server components)
- [ ] 3.3 Implementar rota /auth/callback para OAuth
- [ ] 3.4 Implementar middleware de proteção de rotas
- [ ] 3.5 Implementar página de recuperação de senha
- [ ] 3.6 Implementar botão de logout no navbar
- [ ] 3.7 Criar hook `useUser` para acesso ao usuário logado

## 4. IA Client

- [ ] 4.1 Configurar OpenRouter SDK (ou API compatível com OpenAI)
- [ ] 4.2 Criar serviço `ai-service.ts` com função `callAI(prompt, options)`
- [ ] 4.3 Testar integração com Gemini Flash (modelo gratuito)

## 5. Deploy

- [ ] 5.1 Conectar repositório à Vercel
- [ ] 5.2 Configurar variáveis de ambiente na Vercel
- [ ] 5.3 Fazer deploy inicial e validar
- [ ] 5.4 Rodar validadores: `node .opencode/skills/security-lgpd-review/validate.mjs && node .opencode/skills/code-quality-review/validate.mjs`
