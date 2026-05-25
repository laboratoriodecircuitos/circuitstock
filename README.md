# CircuitStock

Produto local de inventario, auditoria e gestao de componentes eletronicos para laboratorio.

## Objetivo

O CircuitStock tem como objetivo substituir controles em planilhas e centralizar informacoes importantes sobre componentes eletronicos: o que existe no estoque, onde cada item esta guardado, qual a disponibilidade real e se a quantidade disponivel atende a um projeto.

O projeto esta em evolucao continua. A serie 0.x consolida a fundacao do produto, com estrutura, dados locais, primeiras telas reais, fluxos iniciais e documentacao para sustentar as proximas etapas.

Versao atual: `0.5.0` - marco 0.5.0, Fundacao com cadastro inicial de componentes.

Perguntas centrais do sistema:

1. O que eu tenho?
2. Onde esta?
3. Esta disponivel?
4. Isso e suficiente para montar este projeto?

## Stack atual

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- SQLite local
- ESLint
- Estrutura com `src/`

O projeto usa uma stack local com SQLite e ainda nao possui autenticacao.

## Status do desenvolvimento

O projeto possui uma base visual inicial com layout, menu lateral, dashboard operacional com estatisticas, itens em baixa, movimentacoes recentes e ultimos componentes cadastrados, gestao real de categorias e localizacoes, listagem de componentes com busca e filtros, ficha de componente com historico de movimentacoes, cadastro inicial de componentes com campos tecnicos opcionais, edicao segura de dados descritivos e tecnicos, exclusao segura de componentes sem historico de movimentacoes, registro manual de entradas, saidas e ajustes de estoque e auditoria inicial por categoria/localizacao com ajustes controlados.

O Prisma esta configurado com SQLite local, schema inicial, migration aplicada e seed inicial de categorias e localizacoes.

Ainda nao ha BOM Checker implementado. A quantidade atual de componentes nao e editada diretamente no cadastro/edicao; ajustes de estoque sao tratados por movimentacoes manuais ou auditoria com historico. Componentes com historico de movimentacoes nao podem ser excluidos nesta etapa, para preservar rastreabilidade.

## Documentacao de produto

- [Visao do Produto](docs/produto/VISAO_DO_PRODUTO.md)
- [Roadmap CircuitStock](docs/roadmap/ROADMAP_CIRCUITSTOCK.md)
- [Changelog](CHANGELOG.md)

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

## Fora da fundacao atual

- Autenticacao e controle de usuarios.
- Integracoes externas.
- Importacao automatica de fornecedores.
- Leitura automatica de codigos de barras ou QR codes.
- Relatorios avancados.
- Sincronizacao em nuvem.

Esses recursos podem ser avaliados em series futuras, depois que o fluxo local principal estiver estavel.

## Dados locais e arquivos sensiveis

O banco local, arquivos `.env`, backups, exportacoes e outros dados sensiveis nao devem ser versionados. Esses arquivos devem permanecer fora do Git por meio do `.gitignore` ou de outra estrategia equivalente.

O arquivo `.env.example` deve ser versionado para orientar a configuracao local.
