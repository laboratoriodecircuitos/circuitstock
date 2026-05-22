# src/app/localizacoes

Rota usada para listar localizacoes reais cadastradas no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de localizacoes.
- Consultas de leitura necessarias para exibir locais fisicos e contagens resumidas.
- Estados vazios e mensagens da tela de localizacoes.

## O que evitar

- Criar, editar ou excluir localizacoes nesta etapa.
- Misturar movimentacoes de estoque nesta rota.
- Guardar mapas, fotos ou anexos pesados sem criterio definido.
- Registrar dados locais sensiveis no Git.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e lista as localizacoes ordenadas por nome, incluindo a quantidade de componentes vinculados a cada uma.

Ainda nao ha CRUD, formulario de cadastro, edicao ou exclusao de localizacoes.
