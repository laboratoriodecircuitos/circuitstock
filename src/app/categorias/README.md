# src/app/categorias

Rota usada para listar categorias reais cadastradas no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de categorias.
- Consultas de leitura necessarias para exibir categorias e contagens resumidas.
- Estados vazios e mensagens da tela de categorias.

## O que evitar

- Criar, editar ou excluir categorias nesta etapa.
- Duplicar classificacoes fixas diretamente em varios arquivos.
- Colocar regras de componentes que pertencam a rota `componentes`.
- Dados reais ou exportacoes de inventario.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e lista as categorias ordenadas por nome, incluindo a quantidade de componentes vinculados a cada uma.

Ainda nao ha CRUD, formulario de cadastro, edicao ou exclusao de categorias.
