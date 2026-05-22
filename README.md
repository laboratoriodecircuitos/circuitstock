# CircuitStock

Sistema local de inventario, auditoria e consulta de componentes eletronicos para laboratorio.

## Objetivo

O CircuitStock tem como objetivo substituir controles em planilhas e centralizar informacoes importantes sobre componentes eletronicos: o que existe no estoque, onde cada item esta guardado e se a quantidade disponivel atende a um projeto.

Principio central do sistema:

1. O que eu tenho?
2. Onde esta?
3. Isso e suficiente para montar este projeto?

## Stack atual

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- SQLite local
- ESLint
- Estrutura com `src/`

O projeto usa uma stack local e nao possui autenticacao no MVP.

## Status do desenvolvimento

O projeto possui uma base visual inicial com layout, menu lateral, dashboard com estatisticas reais do banco local, listagem real de categorias e paginas placeholder para as demais areas do sistema.

O Prisma esta configurado com SQLite local, schema inicial, migration aplicada e seed basico de categorias e localizacoes.

Ainda nao ha CRUD, formularios de cadastro, auditoria funcional ou BOM Checker implementado.

## Como rodar localmente

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Comandos uteis:

```bash
npm run lint
npm run build
npm run prisma:generate
npm run prisma:validate
npm run prisma:format
npm run prisma:migrate
npm run prisma:studio
npm run db:seed
```

Antes de usar o banco local em uma copia nova do projeto, configure o `.env` com base em `.env.example`, aplique as migrations e rode o seed quando necessario.

## Estrutura inicial de pastas

```text
src/
  app/
    _components/
    auditoria/
    bom-checker/
    categorias/
    componentes/
    localizacoes/
    movimentacoes/
    projetos/
  lib/
  generated/
prisma/
  migrations/
  schema.prisma
  seed.ts
docs/
public/
```

- `src/`: codigo-fonte da aplicacao.
- `src/app/`: rotas, paginas e layout do App Router.
- `src/app/_components/`: componentes reutilizaveis ligados a camada `app`.
- `src/lib/`: helpers compartilhados, incluindo o client Prisma.
- `src/generated/prisma/`: Prisma Client gerado localmente e ignorado pelo Git.
- `prisma/`: schema, migrations e seed do banco SQLite local.
- `docs/`: documentacao tecnica e registros de decisao do projeto.
- `public/`: arquivos publicos estaticos.

## Fora do MVP por enquanto

- Autenticacao e controle de usuarios.
- Integracoes externas.
- Importacao automatica de fornecedores.
- Leitura automatica de codigos de barras ou QR codes.
- Relatorios avancados.
- Sincronizacao em nuvem.

Esses recursos podem ser avaliados em etapas futuras, depois que o fluxo local principal estiver estavel.

## Dados locais e arquivos sensiveis

O banco local, arquivos `.env`, backups, exportacoes e outros dados sensiveis nao devem ser versionados. Esses arquivos devem permanecer fora do Git por meio do `.gitignore` ou de outra estrategia equivalente.

O arquivo `.env.example` deve ser versionado para orientar a configuracao local.
