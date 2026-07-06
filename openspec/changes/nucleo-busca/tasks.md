## 1. Agente RH — Perfil

- [ ] 1.1 Criar tabela `profiles_candidate` no Supabase (todos os campos do perfil JSON)
- [ ] 1.2 Criar página /perfil com layout de chat (mensagens + input)
- [ ] 1.3 Implementar prompt do agente RH (persona consultor, máx 8 perguntas, output JSON)
- [ ] 1.4 Implementar serviço `entrevista-service.ts` que gerencia o fluxo da conversa
- [ ] 1.5 Implementar parse do JSON de resposta e validação de campos
- [ ] 1.6 Implementar salvamento automático do perfil no Supabase
- [ ] 1.7 Implementar tela de revisão/edição manual do perfil
- [ ] 1.8 Implementar opção de reiniciar entrevista

## 2. Busca de Vagas

- [ ] 2.1 Fazer deploy do vagas-dev via Docker local (ou endpoint público)
- [ ] 2.2 Criar serviço `vagas-service.ts` para integração com API do vagas-dev
- [ ] 2.3 Criar tabela `vagas_cache` no Supabase (dados + TTL)
- [ ] 2.4 Implementar cache: buscar da API externa ou do cache
- [ ] 2.5 Criar página /vagas com grid de cards responsivo
- [ ] 2.6 Implementar card de vaga (título, empresa, local, tipo, fonte, badge)
- [ ] 2.7 Implementar filtros: keyword, local, tipo trabalho, fonte
- [ ] 2.8 Implementar busca automática usando keywords do perfil
- [ ] 2.9 Implementar favoritar/desfavoritar vaga (tabela `vagas_favoritas`)
- [ ] 2.10 Abrir link da vaga em nova aba
- [ ] 2.11 Implementar estados: loading skeleton, empty state, error state

## 3. Match Perfil-Vaga

- [ ] 3.1 Implementar função `calcularMatch(perfil, vaga)` com pesos configuráveis
- [ ] 3.2 Implementar ordenação de vagas por score decrescente na página /vagas
- [ ] 3.3 Implementar badge/match indicator visual (score > 70 = verde)
- [ ] 3.4 Implementar tooltip/modal com detalhamento do score
- [ ] 3.5 Integrar match automático: ao criar/editar perfil, recalcular vagas
- [ ] 3.6 Adicionar score visual nos cards de vaga

## 4. Dashboard

- [ ] 4.1 Criar página /dashboard com grid responsivo
- [ ] 4.2 Implementar card "Resumo do Perfil" (senioridade, stack, local)
- [ ] 4.3 Implementar seção "Últimas Vagas Match" (top 5 com score)
- [ ] 4.4 Implementar seção "Histórico" (análises recentes, currículos ajustados)
- [ ] 4.5 Implementar estatísticas rápidas (cards com números)
- [ ] 4.6 Implementar estado vazio com CTA "Criar meu perfil"
- [ ] 4.7 Fazer cards clicáveis para navegação interna
