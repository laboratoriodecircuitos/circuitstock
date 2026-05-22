# prisma

Esta pasta concentra a configuracao e os artefatos do Prisma usados pelo banco local SQLite do CircuitStock.

## O que colocar aqui

- `schema.prisma`, com o modelo de dados da aplicacao.
- `migrations/`, com migrations versionadas geradas pelo Prisma.
- `seed.ts`, com dados iniciais idempotentes para desenvolvimento local.
- Documentacao curta sobre o uso do banco local.

## O que evitar

- Versionar `dev.db`, arquivos `.sqlite`, journals ou backups locais.
- Colocar dados reais de inventario no seed.
- Editar migrations antigas manualmente sem um motivo tecnico claro.

## Estado atual

O Prisma esta configurado com SQLite local. O banco `prisma/dev.db` existe localmente e deve permanecer ignorado pelo Git.

O seed inicial cadastra categorias e localizacoes basicas. Ele pode ser executado mais de uma vez sem duplicar registros.

## Comandos uteis

```bash
npm run prisma:validate
npm run prisma:format
npm run prisma:migrate
npm run prisma:studio
npm run db:seed
```
