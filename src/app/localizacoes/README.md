# src/app/localizacoes

Rota usada para gerir localizacoes reais cadastradas no banco local SQLite.

## O que colocar aqui

- Paginas e componentes especificos da tela de localizacoes.
- Formulario de cadastro de novas localizacoes.
- Rota de edicao de localizacoes existentes.
- Acao visual de exclusao segura, com confirmacao antes de executar.
- Consultas de leitura necessarias para exibir locais fisicos e contagens resumidas.
- Estados vazios e mensagens da tela de localizacoes.

## O que evitar

- Excluir localizacoes sem confirmacao visual.
- Excluir localizacoes que possuem componentes vinculados.
- Misturar movimentacoes de estoque nesta rota.
- Guardar mapas, fotos ou anexos pesados sem criterio definido.
- Registrar dados locais sensiveis no Git.

## Estado atual

A rota consulta o Prisma diretamente em Server Component e lista as localizacoes ordenadas por nome, incluindo a quantidade de componentes vinculados a cada uma.

A tela permite criar localizacoes com nome obrigatorio e descricao opcional. O nome e tratado com `trim` e nao pode ser duplicado.

A rota `localizacoes/[id]/editar` permite editar nome e descricao de uma localizacao existente, preservando os componentes vinculados.

A exclusao e feita pela listagem com confirmacao visual antes do envio. Localizacoes com componentes vinculados nao podem ser excluidas; a tela informa que os componentes devem ser movidos para outra localizacao antes da exclusao.
