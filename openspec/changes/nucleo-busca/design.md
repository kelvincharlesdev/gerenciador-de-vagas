## Context

Construir o coração do produto: agente RH que entrevista o usuário, integração com vagas-dev para buscar vagas, algoritmo de match, e dashboard que unifica tudo.

## Goals / Non-Goals

**Goals:**
- Agente RH com 5-8 perguntas adaptativas, extraindo perfil JSON
- Integração com API do vagas-dev (cache local no Supabase)
- Algoritmo de match com score (0-100) por 5 dimensões
- Dashboard com resumo do perfil + vagas match + histórico
- Fluxo completo: perfil → vagas → match → candidatura

**Non-Goals:**
- Ajuste de currículo (próxima change)
- Novas fontes além de Gupy + LinkedIn
- Agendamento automático de busca (cron)

## Decisions

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Agente RH | Prompt estruturado + JSON parse | Simples, sem framework de agentes |
| Cache vagas | Tabela `vagas_cache` no Supabase | Evita chamadas repetidas à API externa |
| Match | Algoritmo determinístico (pesos fixos) | Transparente, explicável ao usuário |
| UI Vagas | Server Components + client filters | Performance, SEO |

**Estrutura do Prompt do Agente RH:**
```
System: Você é um consultor de RH sênior especializado em TI.
         Faça perguntas naturais. Máximo 8.
         Adapte baseado nas respostas anteriores.
         Ao final, retorne APENAS JSON.

User: Vou te ajudar a encontrar a vaga ideal. Me conta...
```

## Risks / Trade-offs

- vagas-dev pode ficar offline → self-host como fallback
- Consumo de tokens IA: ~2k tokens por entrevista (~300 entrevistas free/dia no Gemini)
- Cache de vagas pode ficar desatualizado → TTL de 1h
