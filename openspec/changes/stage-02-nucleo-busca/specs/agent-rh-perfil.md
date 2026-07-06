# Agent RH — Perfil do Candidato

## Descrição
Entrevista interativa com IA que faz perguntas no estilo consultor de RH para extrair o perfil real do candidato, incluindo senioridade, stack, preferências e soft skills.

## Fluxo Principal
1. Usuário acessa /perfil
2. IA inicia conversa: "Vou te ajudar a encontrar a vaga ideal. Me conta sobre sua área..."
3. IA faz de 5 a 8 perguntas adaptativas (próxima pergunta depende da resposta anterior)
4. Ao final, IA retorna JSON estruturado com o perfil completo
5. Perfil é salvo no Supabase vinculado ao usuário
6. Usuário pode revisar e editar manualmente o perfil gerado

## Dados Extraídos (JSON)
- `area`: área de atuação (desenvolvimento, dados, infra, QA, design, produto)
- `stack_principal`: array de tecnologias principais
- `senioridade`: estagio, junior, pleno, senior, especialista
- `experiencia_anos`: anos de experiência
- `preferencia_local`: remoto, presencial, hibrido
- `faixa_salarial`: { min, max }
- `tipo_contrato`: CLT, PJ, estagio
- `soft_skills`: array
- `keywords_busca`: termos para buscar vagas
- `nivel_ingles`: basico, intermediario, avancado, fluente

## Regras
- Máximo de 8 perguntas por sessão
- IA deve adaptar perguntas com base nas respostas anteriores (uso de chain-of-thought)
- Ao identificar contradições (ex: "sou pleno" + "tenho 6 meses de exp"), a IA deve questionar
- Perfil deve ser persistido e editável
- Usuário pode reiniciar a entrevista a qualquer momento

## Limites
- 1 sessão de entrevista ativa por usuário
- Timeout de 30 min por sessão
