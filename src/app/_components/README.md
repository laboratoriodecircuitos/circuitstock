# src/app/_components

Esta pasta guarda componentes reutilizaveis ligados diretamente a camada `app` atual.

## O que colocar aqui

- Placeholders compartilhados.
- Cards e blocos visuais reutilizaveis.
- Componentes de layout, menus e estruturas de pagina.
- Componentes pequenos usados por mais de uma rota.

## O que evitar

- Componentes muito especificos de uma unica tela, quando fizer mais sentido deixa-los junto da rota.
- Regras de negocio, acesso a banco ou chamadas de persistencia.
- Bibliotecas ou abstracoes genericas sem uso real no projeto.

## Estado atual

Contem o componente compartilhado de placeholder usado pelas paginas iniciais. Novos componentes devem manter a interface simples e orientada a produtividade.
