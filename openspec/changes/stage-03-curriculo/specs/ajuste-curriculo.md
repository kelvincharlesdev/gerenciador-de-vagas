# Ajuste de Currículo

## Descrição
A partir de uma vaga escolhida pelo usuário, a IA reescreve o currículo para maximizar a aderência àquela vaga específica.

## Fluxo Principal
1. Usuário está visualizando uma vaga (de /vagas ou /match)
2. Clica em "Ajustar currículo para esta vaga"
3. IA recebe: currículo atual do usuário + descrição completa da vaga
4. IA reescreve:
   - Ajusta resumo profissional para destacar skills da vaga
   - Reordena experiências mais relevantes
   - Adiciona keywords da vaga naturalmente
   - Sugere remoção de info irrelevante para a vaga
5. Usuário visualiza diff (antes/depois) e pode editar manualmente
6. Usuário pode exportar como PDF ou copiar

## Estratégia de Ajuste
- Manter VERDADE absoluta (não inventar experiências)
- Destacar skills da vaga que o candidato já possui
- Usar mesmas palavras-chave da descrição da vaga
- Ajustar tom e linguagem para o segmento da empresa
- Priorizar formato ATS (sem colunas, sem gráficos, texto puro)

## Regras
- **CRÍTICO**: IA nunca deve inventar experiências, certificações ou habilidades
- Deve ficar claro que é uma versão "otimizada", o original permanece salvo
- Usuário deve aprovar a versão final antes de salvar
- Cada ajuste salvo gera uma nova versão (histórico de versões)
- PDF gerado deve ser ATS-friendly (texto selecionável, sem imagens)
