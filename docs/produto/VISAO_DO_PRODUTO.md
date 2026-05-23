# Visao do Produto

## O que e o CircuitStock

O CircuitStock e um produto local de inventario, auditoria e gestao de componentes eletronicos para laboratorio. Ele centraliza informacoes sobre componentes, categorias, localizacoes, disponibilidade, condicao fisica, custos aproximados, projetos, listas de materiais e documentacao tecnica.

O produto nasce para uso proprio em laboratorio, mas deve ser tratado desde o inicio como uma solucao profissional, confiavel, bonita, util e expansivel. A direcao do projeto e de evolucao continua: cada etapa fortalece a fundacao do sistema e abre caminho para recursos mais completos.

Neste projeto, deve ser evitada a linguagem de produto minimo viavel. O CircuitStock nao e pensado como um experimento descartavel ou uma versao minima sem acabamento. A serie 0.x representa a fundacao do produto: estrutura, modelo de dados, interface, fluxos principais, documentacao e primeiros recursos operacionais.

## Missao

A missao do CircuitStock e tornar o estoque de componentes eletronicos do laboratorio visivel, confiavel e acionavel. O sistema deve ajudar a saber o que existe, onde esta, em que condicao se encontra, se pode ser usado em um projeto e o que precisa ser comprado, auditado, reservado ou substituido.

## Perguntas centrais

O CircuitStock deve responder, de forma cada vez mais completa, as seguintes perguntas:

1. O que eu tenho?
2. Onde esta?
3. Esta disponivel?
4. Esta funcionando?
5. Esta reservado para algum projeto?
6. E suficiente para montar este projeto?
7. O que falta comprar?
8. Quanto custa aproximadamente montar?
9. Quando foi auditado?
10. Quais substitutos posso considerar?
11. Onde esta o datasheet?
12. Quais componentes sao criticos no laboratorio?

## Principios tecnicos

- O uso basico deve funcionar de forma local e offline.
- O banco principal da instalacao local e SQLite.
- A seguranca dos dados do laboratorio e parte essencial do produto.
- Arquivos `.env`, bancos locais, backups, exportacoes e outros arquivos sensiveis nao devem ser versionados.
- A evolucao deve ser incremental, com etapas pequenas, coerentes e verificaveis.
- A documentacao deve acompanhar o desenvolvimento para preservar contexto, decisoes e direcao de produto.

## Visao futura local e offline

A evolucao local e offline do CircuitStock inclui:

- Dashboard operacional.
- Categorias.
- Localizacoes fisicas e hierarquicas.
- Componentes.
- Movimentacoes.
- Auditoria.
- Projetos.
- BOM Checker.
- Lista de compras.
- Codigos internos e SKU.
- Tags.
- Favoritos.
- Nivel critico.
- Status e condicao fisica.
- Reserva para projetos.
- Kits.
- Custos.
- Backup.
- Exportacao e importacao.
- Etiquetas.
- Fotos.
- Datasheets locais.
- Fornecedores.
- QR Code.
- Biblioteca tecnica local.

Esses recursos devem ser introduzidos de forma gradual, mantendo o sistema utilizavel e consistente a cada etapa.

## Visao futura de IA

A inteligencia artificial no CircuitStock deve ser opcional, auxiliar e acionada manualmente. Ela nao deve ser obrigatoria para o uso do produto e nunca deve salvar alteracoes automaticamente sem confirmacao explicita do usuario.

Uma integracao futura com Gemini API podera ser configurada via `.env`, preservando a separacao entre codigo versionado e credenciais locais.

Possibilidades de uso de IA:

- Cadastro assistido de componentes.
- Sugestao de categoria.
- Geracao ou melhoria de descricao.
- Sugestao de tags.
- Sugestao de estoque minimo.
- Normalizacao de nomes.
- Identificacao de duplicatas.
- Interpretacao de BOM.
- Associacao entre BOM e estoque.
- Sugestao de substitutos ou equivalentes, sempre com cautela e revisao humana.
- Busca em linguagem natural.
- Relatorios inteligentes.
- Assistente interno para consulta e operacao do laboratorio.

A IA deve ampliar a capacidade do usuario, nao substituir a validacao tecnica. Em especial, sugestoes sobre substitutos, equivalentes, disponibilidade e uso em projetos devem ser tratadas como apoio e nao como decisao automatica.
