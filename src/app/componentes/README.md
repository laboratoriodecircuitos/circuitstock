# src/app/componentes

Rota usada para consultar componentes reais cadastrados no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de componentes.
- Formulario inicial de cadastro de componentes, incluindo campos tecnicos opcionais.
- Rota de edicao de componentes existentes.
- Consultas de leitura para listar componentes com categoria e localizacao.
- Estados visuais da listagem e do estado vazio.
- Filtros e organizacao da consulta, quando forem implementados.

## O que evitar

- Excluir componentes nesta etapa.
- Alterar quantidade diretamente por formulario comum.
- Duplicar regras de estoque fora de uma camada propria quando o dominio crescer.
- Componentes compartilhados que pertencam a `_components`.
- Dados reais de inventario versionados no repositorio.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e permite cadastro inicial de componentes com categoria, localizacao, quantidade, estoque minimo, status de estoque e campos tecnicos opcionais.

O cadastro contempla fabricante, part number, link do datasheet e link de compra. Esses campos nao sao obrigatorios; quando preenchidos, aparecem na listagem, com datasheet e compra como links clicaveis.

Quando a quantidade inicial e maior que zero, uma movimentacao de estoque do tipo `ENTRY` e registrada automaticamente.

A rota tambem permite editar componentes existentes em `componentes/[id]/editar`. A edicao cobre nome, descricao, categoria, localizacao, valor, unidade, encapsulamento, estoque minimo, fabricante, part number, datasheet, link de compra e observacoes.

A quantidade atual aparece apenas como informacao de leitura na tela de edicao. Ela nao e alterada diretamente porque representa estoque fisico; ajustes de estoque serao tratados por movimentacoes em etapa futura.

Ainda nao ha exclusao, busca, filtros avancados ou movimentacoes manuais.
