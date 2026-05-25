# Design Notes - Google Stitch v1

Este documento resume a referencia visual v1 do CircuitStock criada no Google Stitch. A sintese foi baseada em `dash_code.html`, `DASH_DESIGN.md` e `dash_screen.png`.

## Visao Geral

A referencia apresenta um dashboard operacional para inventario de laboratorio. A composicao combina navegacao lateral fixa, barra superior com busca, faixa de acoes rapidas, cards de resumo, painel de saude do estoque e tabelas densas para itens em baixa e ultimos componentes adicionados.

O resultado visual deve comunicar precisao tecnica, confiabilidade e eficiencia operacional. A interface parece uma ferramenta profissional de laboratorio, com baixa ornamentacao e foco forte em dados.

## Aparencia Geral

- Layout claro na area de trabalho, com fundo frio e levemente azulado.
- Sidebar escura e fixa a esquerda, criando separacao forte entre navegacao e conteudo.
- Conteudo organizado em blocos retangulares com bordas sutis.
- Densidade de informacao alta, mas com boa hierarquia por titulos, cards e tabelas.
- Poucas sombras; a separacao visual vem principalmente de cor, borda e espacamento.

## Paleta de Cores

A especificacao define uma paleta de base Material-like, com superficies claras e tons frios:

- Fundo principal: `#f9f9ff`.
- Superficies brancas ou muito claras: `#ffffff`, `#f2f3fd`, `#ecedf7`.
- Texto principal: `#191b23`.
- Texto secundario: `#424754`.
- Bordas: `#c2c6d6` e `#727785`.
- Primaria: azul profissional `#0058be`, usado em acoes, links e marcacao ativa.
- Sidebar: superficie inversa escura `#2e3038`.
- Erro/critico: vermelho `#ba1a1a`.
- Atencao/terciaria: laranja/marrom tecnico `#924700` e `#b75b00`.

Na adaptacao futura, preservar o contraste entre sidebar escura e conteudo claro, alem dos acentos semanticos para estoque saudavel, baixo e critico.

## Tipografia

A referencia usa:

- Geist como fonte principal para navegacao, titulos, labels e corpo.
- JetBrains Mono para dados tecnicos, part numbers, quantidades e linhas de tabela.

Escala percebida:

- Titulo/metricas grandes: 32px, peso 700.
- Titulos de secao: 20px a 24px, peso 600.
- Texto de corpo: 14px a 16px.
- Labels em caps: 12px, peso 600, letter spacing positivo.
- Dados tecnicos: 13px em mono.

A implementacao futura deve avaliar como carregar essas fontes na stack atual, evitando dependencias externas novas sem decisao explicita.

## Estrutura do Dashboard

1. Sidebar fixa com marca CircuitStock, subtitulo "Gestao de Inventario" e links principais.
2. Top bar fixa com busca global, notificacoes, ajuda e perfil.
3. Barra de acoes rapidas com botoes para novo componente, nova categoria, nova localizacao e criar projeto.
4. Grid de cards KPI:
   - total de componentes;
   - categorias;
   - estoque baixo;
   - projetos ativos.
5. Linha intermediaria:
   - painel "Saude do Estoque" com barras de progresso;
   - tabela "Itens em Baixa".
6. Bloco inferior:
   - tabela "Ultimos Componentes Adicionados".

## Cards

- Cards usam fundo claro, borda fina e raio moderado.
- KPIs possuem uma faixa vertical colorida na esquerda para indicar categoria/semantica.
- Icones aparecem no canto superior direito dos cards.
- Numeros grandes usam alto peso visual e devem ser rapidamente escaneaveis.
- Cards operacionais maiores usam cabecalho com titulo, icone e divisoria.

Preservar a sensacao de ferramenta tecnica: cards contidos, sem decoracao excessiva e sem sombras pesadas.

## Botoes

- Botao primario: fundo azul, texto branco, icone a esquerda.
- Botoes secundarios: fundo claro, borda cinza, texto escuro, icone a esquerda.
- Acoes criticas devem usar vermelho em borda/texto ou estados semanticos.
- Altura e padding sao compactos, adequados a ferramenta operacional.

## Navegacao

- Sidebar fixa com largura aproximada de 260px.
- Fundo escuro, texto claro e icones lineares.
- Item ativo usa barra vertical azul clara e fundo levemente destacado.
- Itens inativos usam opacidade reduzida e hover sutil.
- Ha uma divisao inferior para suporte e sair.

Na adaptacao ao CircuitStock real, preservar clareza dos rotulos em portugues e o estado ativo da rota.

## Espacamentos e Arredondamentos

- Sistema de espacamento baseado em multiplos de 4px.
- Margem de conteudo em torno de 24px.
- Gaps comuns de 12px, 16px e 24px.
- Inputs e botoes com raio pequeno, em torno de 4px.
- Cards e containers com raio de 8px a 12px na referencia visual.
- Tabelas com linhas compactas e padding vertical reduzido.

## Tabelas e Dados

- Tabelas sao centrais para a experiencia.
- Cabecalhos usam labels em maiusculas, cor secundaria e peso semibold.
- Part numbers e valores numericos aparecem em fonte mono.
- Numeros devem alinhar a direita para facilitar comparacao.
- Linhas usam bordas sutis e hover discreto.
- Badges de status usam cor semantica e icone.

## Elementos a Preservar

- Sidebar escura fixa com marca forte.
- Top bar com busca global.
- Barra de acoes rapidas no topo do dashboard.
- Cards KPI com faixa lateral colorida.
- Painel de saude do estoque com barras horizontais.
- Tabelas densas e tecnicas.
- Uso de azul como acao primario.
- Uso de vermelho e laranja para estados de estoque.
- Fonte mono para dados tecnicos.
- Aparencia profissional, precisa e sem ruido visual.

## Cuidados Para Adaptacao

- Nao copiar o HTML exportado de forma literal se ele conflitar com Next.js, TypeScript, Tailwind local ou componentes existentes.
- Evitar dependencias externas novas sem avaliacao.
- Adaptar a navegacao para as rotas reais ja existentes.
- Substituir dados ficticios por consultas reais do Prisma.
- Manter responsividade: a referencia e desktop-first, mas o app deve seguir funcionando em telas menores.
- Preservar acessibilidade de contraste, foco visivel e leitura por teclado.
- Evitar alterar regras de negocio durante a etapa visual futura.
- Reaproveitar padroes ja existentes no CircuitStock quando eles ajudarem a manter estabilidade.
