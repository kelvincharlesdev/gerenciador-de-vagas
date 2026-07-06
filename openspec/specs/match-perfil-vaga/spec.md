# Match Perfil-Vaga

## Descrição
Algoritmo que cruza o perfil do usuário com as vagas disponíveis e retorna as mais compatíveis, ordenadas por pontuação de match.

## Fluxo Principal
1. Após definir o perfil (via agente RH), sistema busca vagas automaticamente
2. Para cada vaga, calcula score de compatibilidade (0-100)
3. Vagas são exibidas ordenadas por score (maior para menor)
4. Score é calculado com base em: stack overlap, senioridade, local, tipo contrato, faixa salarial
5. Vagas com score > 70 são destacadas como "Match Alto"

## Algoritmo de Score
```
pesos = {
  stack_overlap: 0.35,
  senioridade: 0.25,
  local: 0.20,
  tipo_contrato: 0.10,
  faixa_salarial: 0.10
}
```
- stack_overlap: % de tecnologias do perfil que aparecem na vaga
- senioridade: match exato = 100, um nível acima/abaixo = 70, demais = 0
- local: remoto = 100 (qualquer), mesmo estado = 100, mesmo país = 70
- tipo_contrato: match exato = 100
- faixa_salarial: vaga dentro da faixa = 100, até 20% abaixo = 70

## Regras
- Score mínimo para exibir: 30
- Vagas sem descrição detalhada têm score reduzido (falta info para comparar)
- Usuário pode ver o detalhamento do score (por que essa vaga?)
- Match pode ser recalculado quando perfil é atualizado
