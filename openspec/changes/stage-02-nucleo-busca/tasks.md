## 1. Agente RH — Perfil

- [x] 1.1 Criar tabela `profiles_candidate` no Supabase — via `00003_profiles_candidate.sql`
- [x] 1.2 Criar página /perfil com layout de chat (mensagens + input)
- [x] 1.3 Implementar prompt do agente RH (persona consultor, máx 8 perguntas, output JSON)
- [x] 1.4 Implementar serviço `entrevista-service.ts` que gerencia o fluxo da conversa
- [x] 1.5 Implementar parse do JSON de resposta e validação de campos
- [x] 1.6 Implementar salvamento automático do perfil no Supabase
- [x] 1.7 Implementar tela de revisão/edição manual do perfil
- [x] 1.8 Implementar opção de reiniciar entrevista

## 2. Busca de Vagas

- [ ] 2.1 Fazer deploy do vagas-dev via Docker local (ou endpoint público) — **manual**
- [x] 2.2 Criar serviço `vagas-service.ts` para integração com API do vagas-dev
- [x] 2.3 Criar tabela `vagas_cache` no Supabase (dados + TTL) — via `00004_vagas_cache.sql`
- [x] 2.4 Implementar cache: buscar da API externa ou do cache
- [x] 2.5 Criar página /vagas com grid de cards responsivo
- [x] 2.6 Implementar card de vaga (título, empresa, local, tipo, fonte, badge)
- [x] 2.7 Implementar filtros: keyword, local, tipo trabalho, fonte
- [x] 2.8 Implementar busca automática usando keywords do perfil
- [x] 2.9 Implementar favoritar/desfavoritar vaga (tabela `vagas_favoritas`)
- [x] 2.10 Abrir link da vaga em nova aba
- [x] 2.11 Implementar estados: loading skeleton, empty state, error state

## 3. Match Perfil-Vaga

- [x] 3.1 Implementar função `calcularMatch(perfil, vaga)` com pesos configuráveis
- [x] 3.2 Implementar ordenação de vagas por score decrescente na página /vagas
- [x] 3.3 Implementar badge/match indicator visual (score > 70 = verde)
- [x] 3.4 Implementar tooltip/modal com detalhamento do score
- [x] 3.5 Integrar match automático: ao criar/editar perfil, recalcular vagas
- [x] 3.6 Adicionar score visual nos cards de vaga

## 4. Dashboard

- [x] 4.1 Criar página /dashboard com grid responsivo
- [x] 4.2 Implementar card "Resumo do Perfil" (senioridade, stack, local)
- [x] 4.3 Implementar seção "Últimas Vagas Match" (top 5 com score)
- [x] 4.4 Implementar seção "Histórico" (análises recentes, currículos ajustados) — placeholder para Stage 03
- [x] 4.5 Implementar estatísticas rápidas (cards com números)
- [x] 4.6 Implementar estado vazio com CTA "Criar meu perfil"
- [x] 4.7 Fazer cards clicáveis para navegação interna
