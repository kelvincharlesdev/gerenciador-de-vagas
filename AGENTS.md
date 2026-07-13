# AGENTS.md — buscador-de-vagas

## Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS v4
- **Backend/Dados**: Supabase (PostgreSQL + Auth + Storage)
- **IA**: OpenRouter (OpenAI-compatível, modelos gratuitos no MVP)
- **Motor de Vagas**: vagas-dev (API externa, Gupy + LinkedIn)
- **Deploy**: Vercel

## Comandos

```bash
npm run dev          # dev server
npm run build        # build production
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Segurança e LGPD — Regras Obrigatórias

1. NUNCA logar dados pessoais (nome, email, CPF, etc)
2. Toda tabela no Supabase DEVE ter RLS habilitado
3. Usuário só vê PROPRIOS dados
4. Implementar funcionalidade de "excluir meus dados"
5. Senhas NUNCA no frontend (só tokens de sessão)
6. Upload de currículo: bucket PRIVADO, não público
7. Rodar `node .opencode/skills/security-lgpd-review/validate.mjs` depois de cada change

## README

Manter README.md sempre sincronizado com o estado atual do projeto. Toda change que afetar stack, funcionalidades, roadmap ou instruções de setup DEVE atualizar o README junto.

## Conventional Commits

Todo commit DEVE seguir conventional commits com contexto. Cada contexto lógico em um commit separado:

```
chore: add ESLint and Prettier config
feat: implement login with email/password
refactor: move app code into src/ directory
docs: update README with stage progress
fix: translate auth error messages to pt-BR
```

NUNCA fazer commit único com múltiplos contextos.

## Pré-Commit Obrigatório

Antes de todo commit, rodar SEMPRE:

```bash
npm run lint && npm run typecheck
node .opencode/skills/security-lgpd-review/validate.mjs
```

Se algum falhar, corrigir antes de commitar.

## Post-Apply Validation

Após finalizar qualquer `/opsx-apply`, rodar:

```bash
node .opencode/skills/security-lgpd-review/validate.mjs
node .opencode/skills/code-quality-review/validate.mjs
```

Se algum validador apontar CRITICAL issues, corrigir antes de continuar.

## Skills Disponíveis

- `openspec-explore` — Explorar ideias
- `openspec-propose` — Criar proposta
- `openspec-apply-change` — Implementar change
- `openspec-archive-change` — Arquivar change
- `security-lgpd-review` — Validar segurança/LGPD pós-apply
- `code-quality-review` — Validar qualidade e convenções do código
