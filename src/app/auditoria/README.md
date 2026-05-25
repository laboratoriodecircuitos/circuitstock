# src/app/auditoria

Rota usada para conferencia fisica inicial e ajuste controlado de quantidades.

## O que colocar aqui

- Tela de conferencia de estoque por categoria e localizacao.
- Componentes para comparar quantidade registrada e quantidade conferida.
- Server actions para aplicar ajustes controlados como movimentacoes `ADJUSTMENT`.
- Estados de pendencia, divergencia e conclusao, quando forem definidos.

## O que evitar

- Ajustes silenciosos de estoque sem registro.
- Misturar cadastro comum de componentes com fluxo de auditoria.
- Dados reais de conferencias no repositorio.

## Estado atual

A rota consulta categorias, localizacoes e componentes reais pelo Prisma em Server Component. A tela permite filtrar componentes por categoria e/ou localizacao, informar a quantidade real encontrada e aplicar um ajuste individual com motivo obrigatorio.

Quando a quantidade real informada e diferente da quantidade registrada, a auditoria atualiza `Component.quantity` e cria uma `StockMovement` do tipo `ADJUSTMENT` com o delta calculado. A atualizacao e a movimentacao acontecem em transacao Prisma.

Quando nao ha diferenca entre a quantidade real e a quantidade registrada, nenhuma movimentacao e criada. Quantidades negativas e motivos vazios sao bloqueados.

Ainda nao ha entidade propria de auditoria, sessoes de auditoria, relatorios avancados ou aplicacao em lote complexa.
