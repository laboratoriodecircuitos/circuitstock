# src/lib

Esta pasta guarda helpers compartilhados que nao pertencem diretamente a uma rota ou componente visual.

## O que colocar aqui

- Instancias centralizadas de clientes e servicos internos.
- Funcoes utilitarias usadas por mais de uma parte da aplicacao.
- Camadas pequenas de acesso a infraestrutura local.

## O que evitar

- Componentes React de interface.
- Regras de negocio grandes sem organizacao propria.
- Codigo gerado automaticamente.

## Estado atual

Contem o helper `prisma.ts`, responsavel por criar uma instancia segura do Prisma Client com o adaptador SQLite e reutiliza-la em desenvolvimento quando possivel.
