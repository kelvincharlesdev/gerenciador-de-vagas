# Dashboard do Usuário

## Descrição
Painel central do usuário com resumo do perfil, vagas favoritas, histórico de análises e currículos ajustados.

## Seções
1. **Resumo do Perfil**: Card com dados do agente RH (senioridade, stack, local)
   - Botão "Refazer entrevista" → reinicia agente RH
   - Botão "Editar manualmente" → edição inline
2. **Últimas Vagas Match**: Top 5 vagas com maior score
   - Link para /vagas para ver todas
3. **Histórico de Análises**: Últimas análises de currículo
   - Score geral, data, link para detalhes
4. **Currículos Ajustados**: Versões salvas de currículos otimizados
   - Nome da vaga alvo, data, score de melhoria
5. **Estatísticas Rápidas**:
   - Total de vagas visualizadas
   - Total de currículos ajustados
   - Score médio dos matches

## Regras
- Dashboard é a página pós-login (/dashboard)
- Dados devem vir de consultas Supabase com RLS
- Layout responsivo (grid que se adapta)
- Cards clicáveis para navegação
- Estado vazio com CTA para criar perfil
