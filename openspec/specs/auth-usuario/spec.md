# Autenticação de Usuário

## Descrição
Autenticação e gerenciamento de sessão via Supabase Auth, com suporte a Google, GitHub e email/senha.

## Fluxo Principal
1. Usuário acessa /login
2. Escolhe provedor: Google, GitHub ou email+senha
3. Supabase Auth processa e retorna sessão
4. Usuário logado é redirecionado ao dashboard
5. Sessão persistida via cookie (Next.js + Supabase SSR)

## Telas
- `/login`: Tela de login com botões dos provedores
- `/auth/callback`: Rota de callback OAuth
- Recuperação de senha (email)

## Regras
- RLS (Row Level Security) no Supabase: usuário só vê seus próprios dados
- Rotas protegidas: redirecionar para /login se não autenticado
- Sessão deve ter refresh automático (Supabase SDK gerencia)
- Dados do usuário (nome, email, avatar) sincronizados com a tabela `profiles`
- Suporte a logout
- Plano free: até 50.000 usuários
