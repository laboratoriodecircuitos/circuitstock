# src/app/componentes

Rota usada para consultar componentes reais cadastrados no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de componentes.
- Formulario inicial de cadastro de componentes, incluindo campos tecnicos opcionais.
- Rota de edicao de componentes existentes.
- Acao visual de exclusao segura, com confirmacao antes de executar.
- Consultas de leitura para listar componentes com categoria e localizacao.
- Estados visuais da listagem e do estado vazio.
- Busca e filtros da consulta por query string.

## O que evitar

- Excluir componentes sem confirmacao visual.
- Excluir componentes que possuem historico de movimentacoes de estoque.
- Alterar quantidade diretamente por formulario comum.
- Duplicar regras de estoque fora de uma camada propria quando o dominio crescer.
- Componentes compartilhados que pertencam a `_components`.
- Dados reais de inventario versionados no repositorio.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e permite cadastro inicial de componentes com categoria, localizacao, quantidade, estoque minimo, status de estoque e campos tecnicos opcionais.

A listagem possui busca e filtros via query string, executados no servidor com Prisma. A busca textual cobre `name`, `description`, `value`, `unit`, `packageType`, `manufacturer`, `partNumber` e `notes`. Tambem ha filtros por `categoryId`, `locationId` e status de estoque. O status segue a regra atual: `Em baixa` quando `quantity <= minimumQuantity` e `OK` quando `quantity > minimumQuantity`.

O cadastro contempla fabricante, part number, link do datasheet e link de compra. Esses campos nao sao obrigatorios; quando preenchidos, aparecem na listagem, com datasheet e compra como links clicaveis.

Quando a quantidade inicial e maior que zero, uma movimentacao de estoque do tipo `ENTRY` e registrada automaticamente.

A rota tambem permite editar componentes existentes em `componentes/[id]/editar`. A edicao cobre nome, descricao, categoria, localizacao, valor, unidade, encapsulamento, estoque minimo, fabricante, part number, datasheet, link de compra e observacoes.

A quantidade atual aparece apenas como informacao de leitura na tela de edicao. Ela nao e alterada diretamente porque representa estoque fisico; ajustes de estoque serao tratados por movimentacoes em etapa futura.

A rota permite excluir componentes diretamente pela listagem, sempre com confirmacao visual antes do envio. A exclusao e bloqueada quando o componente possui qualquer `StockMovement` associado, preservando o historico de estoque. Quando nao ha historico, apenas o `Component` e removido.

Ainda nao ha movimentacoes manuais.
