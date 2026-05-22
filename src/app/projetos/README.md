# src/app/projetos

Rota prevista para cadastro de projetos eletronicos relacionados ao estoque.

## O que colocar aqui

- Paginas de cadastro e listagem de projetos.
- Componentes especificos para resumo de projetos.
- Relacoes futuras entre projetos, BOMs e consumo de componentes.

## O que evitar

- Implementar comparacao de BOM diretamente nesta rota quando pertencer ao `bom-checker`.
- Guardar arquivos de projeto sensiveis ou anexos grandes sem estrategia definida.
- Misturar regras de inventario com apresentacao visual.

## Estado atual

A rota contem apenas uma pagina placeholder. O cadastro de projetos sera implementado em etapas futuras.
