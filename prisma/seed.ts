import { prisma } from "../src/lib/prisma";

const categories = [
  { name: "Resistores" },
  { name: "Capacitores" },
  { name: "Diodos" },
  { name: "Transistores" },
  { name: "Circuitos Integrados" },
  { name: "Microcontroladores" },
  { name: "Módulos", aliases: ["Modulos"] },
  { name: "Sensores" },
  { name: "Displays" },
  { name: "Conectores" },
  { name: "Prototipagem" },
  { name: "Alimentação", aliases: ["Alimentacao"] },
  { name: "Mecânica", aliases: ["Mecanica"] },
  { name: "Ferramentas" },
];

const locations = [
  { name: "Gaveteiro A" },
  { name: "Gaveta A1" },
  { name: "Gaveta A2" },
  { name: "Gaveta A3" },
  { name: "Gaveteiro B" },
  { name: "Caixa de Sensores" },
  { name: "Caixa de Módulos", aliases: ["Caixa de Modulos"] },
  { name: "Maleta de Prototipagem" },
  { name: "Bancada Principal" },
];

async function main() {
  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name },
    });

    if (existing) {
      continue;
    }

    const alias = category.aliases?.length
      ? await prisma.category.findFirst({
          where: { name: { in: category.aliases } },
        })
      : null;

    if (alias) {
      await prisma.category.update({
        where: { id: alias.id },
        data: { name: category.name },
      });
      continue;
    }

    await prisma.category.create({
      data: { name: category.name },
    });
  }

  for (const location of locations) {
    const existing = await prisma.location.findUnique({
      where: { name: location.name },
    });

    if (existing) {
      continue;
    }

    const alias = location.aliases?.length
      ? await prisma.location.findFirst({
          where: { name: { in: location.aliases } },
        })
      : null;

    if (alias) {
      await prisma.location.update({
        where: { id: alias.id },
        data: { name: location.name },
      });
      continue;
    }

    await prisma.location.create({
      data: { name: location.name },
    });
  }

  console.log(
    `Seed concluido: ${categories.length} categorias e ${locations.length} localizacoes verificadas.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
