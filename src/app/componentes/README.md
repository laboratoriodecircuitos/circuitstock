# src/app/componentes

Rota usada para consultar componentes reais cadastrados no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de componentes.
- Formulario inicial de cadastro de componentes.
- Consultas de leitura para listar componentes com categoria e localizacao.
- Estados visuais da listagem e do estado vazio.
- Filtros e organizacao da consulta, quando forem implementados.

## O que evitar

- Editar ou excluir componentes nesta etapa.
- Duplicar regras de estoque fora de uma camada propria quando o dominio crescer.
- Componentes compartilhados que pertencam a `_components`.
- Dados reais de inventario versionados no repositorio.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e permite cadastro inicial de componentes com categoria, localizacao, quantidade, estoque minimo e status de estoque.

Quando a quantidade inicial e maior que zero, uma movimentacao de estoque do tipo `ENTRY` e registrada automaticamente.

Ainda nao ha edicao, exclusao, busca ou filtros avancados.
