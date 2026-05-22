# src/app/movimentacoes

Rota prevista para historico de entrada, saida e ajuste de estoque.

## O que colocar aqui

- Paginas de consulta do historico de movimentacoes.
- Filtros por componente, data, tipo de movimento ou projeto.
- Componentes especificos para apresentar eventos de estoque.

## O que evitar

- Alterar quantidades sem uma regra de dominio centralizada.
- Duplicar logica de auditoria ou cadastro de componentes.
- Versionar registros reais de movimentacao.

## Estado atual

A rota contem apenas uma pagina placeholder. O historico de estoque sera implementado depois da base de dados local.
