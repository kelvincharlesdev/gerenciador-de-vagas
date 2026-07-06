## Why

O valor principal do SaaS é ajudar o usuário a encontrar vagas compatíveis com seu perfil. Para isso, precisamos do agente RH que extrai o perfil real do candidato, da integração com o vagas-dev para buscar vagas, do algoritmo de match entre perfil e vagas, e de um dashboard que unifica tudo.

## What Changes

- Implementar agente RH (entrevista IA com 5-8 perguntas, extração de perfil JSON)
- Integrar com API do vagas-dev (Gupy + LinkedIn)
- Implementar algoritmo de match perfil-vaga com score (0-100)
- Criar dashboard do usuário com resumo, vagas match, histórico
- Criar páginas: /perfil, /vagas, /dashboard

## Capabilities

### New Capabilities
- `agent-rh-perfil`: Entrevista IA no estilo consultor RH para extrair perfil do candidato
- `busca-vagas`: Integração com vagas-dev + cache + filtros
- `match-perfil-vaga`: Algoritmo de score entre perfil e vagas
- `dashboard`: Painel central com resumo e acesso rápido

### Modified Capabilities
*Nenhuma — specs já existem em openspec/specs/*

## Impact

- Dependência externa: API do vagas-dev (self-hosted ou pública)
- Dependência externa: API de IA (OpenRouter)
- Novas tabelas no Supabase: profiles_candidate, vagas_cache, vagas_favoritas
- Consumo de tokens de IA na entrevista do agente RH
