## Context

Após encontrar vagas, o usuário precisa preparar a candidatura. Análise de currículo e ajuste por vaga específica são features de alto valor que completam o fluxo do produto.

## Goals / Non-Goals

**Goals:**
- Upload de PDF + extração de texto com pdf.js
- Análise IA com score geral (0-100) + 5 eixos + sugestões
- Ajuste de currículo otimizado por vaga (reescrita seletiva)
- Visualização diff (antes/depois) do currículo ajustado
- Exportação PDF ATS-friendly

**Non-Goals:**
- Criação de currículo do zero (feature futura)
- Análise de LinkedIn (feature futura)
- Simulação de entrevista (feature futura)

## Decisions

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| PDF Parser | pdf.js (client-side) | Evita envio para servidor extra |
| Storage | Supabase Storage (bucket privado) | RLS por usuário |
| Análise IA | Prompt único com texto extraído + perfil | Simples, sem necessidade de RAG no MVP |
| Formato PDF | @react-pdf/renderer | Geração client-side, sem servidor |
| Versões | Tabela `curriculos_versoes` com diff JSON | Histórico completo, rollback |

**Prompt de Ajuste — Regra Crítica:**
```
REGRAS ABSOLUTAS:
- NUNCA invente experiências, certificações ou habilidades
- Apenas reordene, destaque e reformule o que já existe
- Use keywords da vaga onde o candidato já tem a skill
- Mantenha formato ATS (texto puro, sem colunas)
```

## Risks / Trade-offs

- pdf.js pode falhar em PDFs escaneados/imagem → avisar usuário
- IA pode sugerir ajustes imprecisos → usuário sempre aprova antes
- Geração PDF no client pode ser limitada em dispositivos fracos
