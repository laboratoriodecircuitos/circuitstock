# src

Esta pasta contem o codigo-fonte principal do CircuitStock.

## O que colocar aqui

- Rotas, paginas e layouts da aplicacao.
- Componentes React usados pela interface.
- Helpers compartilhados, como acesso centralizado ao Prisma Client.
- Codigo de dominio e integracoes futuras, quando forem criados.

## O que evitar

- Arquivos gerados automaticamente.
- Dados locais de estoque ou banco SQLite.
- Documentacao extensa que pertenca a `docs/`.

## Estado atual

Atualmente o codigo esta concentrado em `src/app`, usando o App Router do Next.js, e em `src/lib`, com o helper inicial do Prisma Client.

Ainda nao ha CRUD, integracao visual com banco ou regras de negocio completas implementadas.
