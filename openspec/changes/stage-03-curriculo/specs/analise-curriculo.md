# Análise de Currículo

## Descrição
Upload de currículo em PDF + análise de IA que avalia pontos fortes, gaps e aderência ao formato ATS.

## Fluxo Principal
1. Usuário acessa /curriculo/analisar
2. Faz upload do PDF (arrastar ou selecionar)
3. IA extrai texto do PDF e analisa:
   - Pontuação geral (0-100)
   - Pontos fortes
   - Gaps e pontos fracos
   - Aderência ATS (formato, keywords, estrutura)
   - Sugestões de melhoria priorizadas
4. Resultado exibido em dashboard visual com scores por eixo

## Eixos de Avaliação
- `formato_ats`: o currículo passa em triagem automática?
- `clareza`: as informações são claras e objetivas?
- `impacto`: as experiências têm resultados quantificáveis?
- `keywords`: as palavras-chave da área estão presentes?
- `completude`: faltam seções essenciais?

## Regras
- PDFs devem ser armazenados no Supabase Storage (pasta privada do usuário)
- Máximo 10MB por arquivo
- Extração de texto via PDF parser (pdf.js ou similar)
- Análise via IA usando o texto extraído + o perfil do usuário como contexto
- Resultado deve ser salvo no banco para consulta futura
- Usuário pode refazer a análise após editar o currículo
