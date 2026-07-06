## Why

Depois de encontrar vagas compatíveis, o usuário precisa se preparar para candidatura. Analisar o currículo atual e ajustá-lo especificamente para cada vaga aumenta drasticamente as chances de ser chamado. Esse é o complemento final do fluxo.

## What Changes

- Implementar upload de PDF + extração de texto
- Implementar análise de currículo com IA (score por 5 eixos)
- Implementar ajuste de currículo otimizado por vaga específica
- Implementar exportação de currículo em PDF ATS-friendly
- Criar páginas: /curriculo/analisar, /curriculo/ajustar

## Capabilities

### New Capabilities
- `analise-curriculo`: Upload PDF + análise IA com scores e sugestões
- `ajuste-curriculo`: Reescreve currículo para vaga alvo + diff + export PDF

### Modified Capabilities
*Nenhuma — specs já existem em openspec/specs/*

## Impact

- Dependência: Supabase Storage para armazenar PDFs
- Dependência: IA para análise e ajuste (consumo maior de tokens)
- Novas tabelas: analises_curriculo, curriculos_versoes
- Máximo 10MB por upload de PDF
