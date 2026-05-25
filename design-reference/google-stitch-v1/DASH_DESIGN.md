---
name: CircuitStock
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter: 16px
  sidebar-width: 260px
  stack-gap: 12px
---

## Brand & Style

O sistema de design é construído sobre os pilares da **precisão técnica, eficiência operacional e confiabilidade laboratorial**. O objetivo é transformar a gestão de inventário de componentes eletrônicos em uma experiência fluida, minimizando o erro humano através de uma hierarquia visual rigorosa.

A estética adota um estilo **Moderno e Corporativo**, com influências do design utilitário suíço. O foco está na densidade de informações equilibrada, permitindo que engenheiros e técnicos visualizem grandes conjuntos de dados sem fadiga visual. A interface deve parecer uma ferramenta de precisão, comparável a um osciloscópio moderno ou software de CAD.

**Objetivos Emocionais:**
- **Confiança:** Transmitir que cada item está exatamente onde deveria estar.
- **Foco:** Eliminar distrações visuais para priorizar dados técnicos.
- **Agilidade:** Facilitar a entrada e saída de componentes com interações rápidas.

## Colors

A paleta de cores é funcional e semântica, servindo como a primeira camada de comunicação do status do inventário.

- **Primária (Azul Profissional):** Utilizada para ações principais, foco de navegação e indicações de seleção. Transmite estabilidade.
- **Neutras (Slate/Gray):** Uma escala de cinzas frios que define a estrutura. O fundo é levemente acinzentado (`#f8fafc`) para reduzir o brilho em ambientes de laboratório iluminados, enquanto as superfícies de conteúdo (cards e tabelas) permanecem brancas puras.
- **Semânticas de Estoque:**
    - **Verde (Saudável):** Quantidade acima do ponto de ressuprimento.
    - **Âmbar (Atenção):** Nível de estoque baixo, ressuprimento necessário.
    - **Vermelho (Crítico):** Item esgotado ou quantidade insuficiente para operações imediatas.

## Typography

Utilizamos a **Geist** como fonte principal devido à sua legibilidade excepcional em contextos técnicos e sua estética minimalista. Para identificadores de componentes (SKUs, Part Numbers, Endereços de Prateleira), introduzimos a **JetBrains Mono**, garantindo que caracteres ambíguos (como '0' e 'O' ou '1' e 'l') sejam facilmente distinguidos.

**Diretrizes de Uso:**
- **Display e Headlines:** Usadas para títulos de páginas e categorias de inventário.
- **Body-md:** O padrão para descrições de componentes e entradas de formulário.
- **Label-caps:** Para cabeçalhos de tabelas e metadados curtos.
- **Data-mono:** Exclusiva para números de série, referências de fabricantes e coordenadas de localização no laboratório.

## Layout & Spacing

O layout adota um modelo de **Grid Fluida** com uma estrutura de navegação lateral fixa (sidebar).

- **Sidebar:** Fixa à esquerda em desktop, recolhível em tablets. Contém a navegação principal, busca global e filtros rápidos.
- **Área de Conteúdo:** Utiliza um sistema de 12 colunas para dashboards e 1 coluna total para tabelas de dados extensas.
- **Ritmo Vertical:** Baseado em múltiplos de 4px. Elementos relacionados mantêm 8px ou 12px de distância, enquanto seções distintas se separam por 24px ou 32px.
- **Densidade:** Alta. Em tabelas de inventário, o padding vertical das linhas deve ser reduzido (8px) para maximizar a visibilidade dos itens sem necessidade de scroll excessivo.

## Elevation & Depth

A hierarquia é definida principalmente através de **Camadas Tonais** e **Bordas Sutis**, evitando sombras pesadas que possam poluir a interface técnica.

1. **Nível 0 (Fundo):** `#f8fafc`. A base da aplicação.
2. **Nível 1 (Superfície):** Branca, com borda de 1px em `#e2e8f0`. Usada para containers de conteúdo e cards de componentes.
3. **Nível 2 (Elevação Ativa):** Sombras ambientais muito leves (blur de 4px, 5% de opacidade preta) aplicadas apenas a elementos em hover ou modais, para indicar interatividade.
4. **Foco:** Estados de foco em campos de entrada utilizam um anel de 2px na cor primária com 20% de transparência.

## Shapes

O sistema utiliza o nível **Soft (0.25rem)** para cantos arredondados. Esta escolha equilibra a rigidez de um ambiente técnico com a modernidade de uma aplicação web contemporânea.

- **Botões e Inputs:** 4px de raio.
- **Cards e Modais:** 8px (rounded-lg) para criar uma contenção clara do conteúdo.
- **Badges de Status:** Totalmente arredondados (pill-shaped) para se destacarem das formas retangulares dos dados, facilitando a identificação rápida do status do estoque.

## Components

### Tabelas de Dados (Data Tables)
É o componente central. Devem possuir cabeçalhos fixos e linhas com efeito de zebra muito sutil. O alinhamento numérico deve ser à direita para facilitar a comparação de quantidades.

### Badges de Status
Pequenos indicadores coloridos que utilizam as cores semânticas (Verde, Âmbar, Vermelho). Devem incluir um ícone de suporte (ex: check, alerta, X) para acessibilidade por cor.

### Sidebar de Navegação
Fundo em cinza escuro ou azul profundo para contraste máximo com a área de trabalho. Ícones devem ser lineares (2px stroke) e acompanhados de rótulos claros em português.

### Inputs e Formulários
Rótulos sempre acima do campo. Campos obrigatórios marcados discretamente. Devem incluir suporte para leitura de código de barras via input de texto focado.

### Botões de Ação
- **Primário:** Preenchimento total em Azul Profissional com texto branco.
- **Secundário:** Borda cinza com texto em cinza escuro.
- **Ação Crítica:** Borda vermelha com texto vermelho para exclusões de itens ou baixas de estoque.

### Cards de Resumo (KPIs)
Exibidos no topo do dashboard para mostrar: "Total de Itens", "Baixo Estoque", "Pedidos Pendentes" e "Valor Total do Inventário".