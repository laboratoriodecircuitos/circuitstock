# src/app

Esta pasta usa o App Router do Next.js e concentra as rotas, paginas e o layout principal do CircuitStock.

## O que colocar aqui

- `layout.tsx` para estrutura compartilhada da aplicacao.
- `page.tsx` para a pagina inicial.
- Pastas de rotas, como `componentes`, `categorias` e `auditoria`.
- Componentes diretamente ligados a camada `app`, preferencialmente em `_components`.

## O que evitar

- Regras de negocio complexas misturadas diretamente nas paginas.
- Acesso direto a banco de dados espalhado em componentes visuais.
- Arquivos grandes de documentacao ou registros operacionais.

## Estado atual

A pasta possui o layout visual inicial, dashboard lendo estatisticas reais do banco local, rota de componentes com cadastro inicial, campos tecnicos opcionais, listagem com busca e filtros, ficha de detalhe com historico por componente, edicao segura de dados descritivos e exclusao segura de componentes sem historico, rota de movimentacoes manuais com historico, rotas de categorias e localizacoes consultando dados reais e paginas placeholder para as demais secoes. Fluxos completos serao implementados em etapas futuras.
