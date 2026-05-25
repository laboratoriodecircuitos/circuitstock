# src/app/categorias

Rota usada para gerir categorias reais cadastradas no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de categorias.
- Formulario de cadastro de novas categorias.
- Rota de edicao de categorias existentes.
- Acao visual de exclusao segura, com confirmacao antes de executar.
- Consultas de leitura necessarias para exibir categorias e contagens resumidas.
- Estados vazios e mensagens da tela de categorias.

## O que evitar

- Excluir categorias sem confirmacao visual.
- Excluir categorias que possuem componentes vinculados.
- Duplicar classificacoes fixas diretamente em varios arquivos.
- Colocar regras de componentes que pertencam a rota `componentes`.
- Dados reais ou exportacoes de inventario.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e lista as categorias ordenadas por nome, incluindo a quantidade de componentes vinculados a cada uma.

A tela permite criar categorias com nome obrigatorio e descricao opcional. O nome e tratado com `trim` e nao pode ser duplicado.

A rota `categorias/[id]/editar` permite editar nome e descricao de uma categoria existente, preservando os componentes vinculados.

A exclusao e feita pela listagem com confirmacao visual antes do envio. Categorias com componentes vinculados nao podem ser excluidas; a tela informa que os componentes devem ser movidos para outra categoria antes da exclusao.
