# Busca de Vagas

## Descrição
Integração com a API do vagas-dev para buscar vagas do Gupy e LinkedIn, com filtros e ordenação.

## Fluxo Principal
1. Usuário acessa /vagas (com perfil já criado ou manualmente)
2. Sistema busca vagas na API do vagas-dev com as keywords do perfil
3. Vagas são exibidas em cards com: título, empresa, local, tipo, salário (quando disponível), fonte
4. Usuário pode filtrar por: keyword, local, tipo (remoto/presencial/hibrido), fonte, senioridade
5. Usuário pode salvar vagas favoritas
6. Ao clicar em uma vaga, redireciona para o site original ou exibe detalhes

## Integração com vagas-dev
- Endpoint: `GET /jobs?keyword={termo}&limit=50`
- A API do vagas-dev é pública (https://vagas-api.henriquesebastiao.com) ou self-hosted
- Cache local no Supabase para evitar chamadas repetidas à API
- Scheduler opcional: atualizar vagas a cada 6h via cron

## Regras
- Resultados devem ser armazenados em cache (evitar chamadas excessivas)
- Vagas duplicadas devem ser deduplicadas
- Exibir badge da fonte (Gupy, LinkedIn)
- Link externo deve abrir em nova aba
- Feedbacks: loading state, empty state, error state

## Limites
- Cache mínimo de 1h entre chamadas com mesmos parâmetros
- Máximo de 100 resultados por busca
