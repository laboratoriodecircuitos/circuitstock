# src/app/movimentacoes

Rota usada para registrar movimentacoes manuais de estoque e consultar o historico.

## O que colocar aqui

- Pagina de consulta do historico de movimentacoes.
- Formulario de movimentacao manual com motivo obrigatorio.
- Registro de entrada, saida e ajuste de quantidade real.
- Filtros por componente, data, tipo de movimento ou projeto.
- Componentes especificos para apresentar eventos de estoque.

## O que evitar

- Alterar quantidades sem uma regra de dominio centralizada.
- Duplicar logica de auditoria ou cadastro de componentes.
- Versionar registros reais de movimentacao.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e carrega componentes reais para registrar movimentacoes manuais.

As movimentacoes disponiveis sao:

- `ENTRY`: adiciona uma quantidade positiva ao estoque e registra `StockMovement.quantity` positivo.
- `EXIT`: remove uma quantidade positiva do estoque atual, bloqueando saida maior que o saldo disponivel, e registra `StockMovement.quantity` negativo.
- `ADJUSTMENT`: define a quantidade final real encontrada, calcula o delta em relacao ao estoque atual e registra esse delta no historico.

Toda movimentacao manual exige motivo para preservar rastreabilidade. Atualizacao de `Component.quantity` e criacao de `StockMovement` acontecem em transacao Prisma. A listagem mostra as movimentacoes mais recentes primeiro, com data/hora, componente, tipo, variacao e motivo.

Ainda nao ha filtros do historico por componente, data, tipo de movimento ou projeto.
