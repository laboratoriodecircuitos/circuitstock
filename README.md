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
- ESLint
- Estrutura com `src/`

Nesta etapa ainda nao ha Prisma, banco SQLite, autenticacao, CRUD ou funcionalidades reais de inventario.

## Status do desenvolvimento

O projeto possui uma base visual inicial com layout, menu lateral, dashboard estatico e paginas placeholder para as principais areas do sistema.

As proximas etapas previstas incluem configurar Prisma + SQLite, modelar os dados principais e implementar os primeiros cadastros.

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
```

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
docs/
public/
```

- `src/`: codigo-fonte da aplicacao.
- `src/app/`: rotas, paginas e layout do App Router.
- `src/app/_components/`: componentes reutilizaveis ligados a camada `app`.
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

O banco local, arquivos `.env`, backups, exportacoes e outros dados sensiveis nao devem ser versionados. Quando forem criados, esses arquivos devem permanecer fora do Git por meio do `.gitignore` ou de outra estrategia equivalente.
