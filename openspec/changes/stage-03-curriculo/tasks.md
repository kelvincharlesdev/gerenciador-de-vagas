## 1. Análise de Currículo

- [ ] 1.1 Instalar pdf.js (react-pdf) para extração de texto no client
- [ ] 1.2 Criar página /curriculo/analisar com upload drag & drop
- [ ] 1.3 Implementar upload para Supabase Storage (pasta privada do usuário)
- [ ] 1.4 Implementar extração de texto do PDF via pdf.js
- [ ] 1.5 Criar prompt de análise: 5 eixos (formato ATS, clareza, impacto, keywords, completude)
- [ ] 1.6 Implementar serviço `analise-service.ts` que chama IA com texto + perfil
- [ ] 1.7 Implementar exibição do resultado: score geral circular + scores por eixo + sugestões
- [ ] 1.8 Criar tabela `analises_curriculo` no Supabase para histórico
- [ ] 1.9 Implementar salvamento do resultado da análise
- [ ] 1.10 Exibir histórico de análises na página

## 2. Ajuste de Currículo

- [ ] 2.1 Adicionar botão "Ajustar currículo para esta vaga" na página de detalhes da vaga
- [ ] 2.2 Criar página /curriculo/ajustar com layout de comparação lado a lado
- [ ] 2.3 Criar prompt de ajuste: currículo + descrição da vaga → currículo otimizado
- [ ] 2.4 Implementar serviço `ajuste-service.ts` com regra de NÃO inventar dados
- [ ] 2.5 Implementar visualização diff (antes/depois) destacando mudanças
- [ ] 2.6 Implementar editor manual inline do currículo ajustado
- [ ] 2.7 Criar tabela `curriculos_versoes` (currículo original, ajustado, vaga alvo, data)
- [ ] 2.8 Implementar salvamento de versões (cada ajuste gera nova versão)
- [ ] 2.9 Implementar exportação como PDF ATS-friendly (@react-pdf/renderer)
- [ ] 2.10 Implementar botão "Copiar currículo" para área de transferência

## 3. Integração com Fluxo Principal

- [ ] 3.1 Vincular ajuste de currículo ao card de vaga com score alto
- [ ] 3.2 Adicionar seção de currículos ajustados no Dashboard
- [ ] 3.3 Navegação: da vaga → ajustar currículo → download
