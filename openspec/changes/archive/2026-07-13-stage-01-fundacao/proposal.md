## Why

O projeto precisa de uma base sólida antes de qualquer funcionalidade: setup do Next.js, configuração do Supabase (auth + banco + storage), deploy contínuo e autenticação de usuários. Sem essa fundação, nada pode ser construído.

## What Changes

- Inicializar projeto Next.js 16 com App Router e Tailwind CSS v4
- Configurar Supabase (projeto, Auth, banco PostgreSQL, Storage)
- Configurar integração com API de IA (OpenRouter)
- Implementar sistema de autenticação (Google, GitHub, email)
- Configurar estrutura de banco de dados (tabelas, RLS, triggers)
- Configurar deploy na Vercel
- Configurar ferramentas de qualidade (ESLint, AGENTS.md)

## Capabilities

### New Capabilities
- `auth-usuario`: Autenticação com Supabase (Google, GitHub, email) + RLS + proteção de rotas

### Modified Capabilities
*Nenhuma — primeira change do projeto.*

## Impact

- Criação do repositório do zero
- Dependências: Next.js, Tailwind, Supabase SDK, OpenRouter SDK
- Deploy na Vercel (plano free)
- Nenhum impacto em sistemas existentes
