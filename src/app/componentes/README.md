# src/app/componentes

Rota usada para consultar componentes reais cadastrados no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de componentes.
- Consultas de leitura para listar componentes com categoria e localizacao.
- Estados visuais da listagem e do estado vazio.
- Filtros e organizacao da consulta, quando forem implementados.

## O que evitar

- Criar, editar ou excluir componentes nesta etapa.
- Duplicar regras de estoque fora de uma camada propria quando o dominio crescer.
- Componentes compartilhados que pertencam a `_components`.
- Dados reais de inventario versionados no repositorio.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e esta preparada para listar componentes com categoria, localizacao, quantidade, estoque minimo e status de estoque.

Como ainda nao ha componentes cadastrados, a tela exibe um estado vazio. Ainda nao ha CRUD, formulario de cadastro, edicao ou exclusao.
