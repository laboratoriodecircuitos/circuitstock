import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  await connection();

  const [
    totalComponents,
    totalCategories,
    totalLocations,
    lowStockItems,
    activeProjects,
  ] = await Promise.all([
    prisma.component.count(),
    prisma.category.count(),
    prisma.location.count(),
    prisma.component.count({
      where: {
        quantity: {
          lte: prisma.component.fields.minimumQuantity,
        },
      },
    }),
    prisma.project.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  return [
    { label: "Total de componentes", value: totalComponents },
    { label: "Categorias", value: totalCategories },
    { label: "Localizacoes", value: totalLocations },
    { label: "Itens em baixa", value: lowStockItems },
    { label: "Projetos ativos", value: activeProjects },
  ];
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <section className="mx-auto max-w-6xl">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
          Visao geral
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Painel inicial para acompanhar o inventario, pontos de atencao e
          futuras atividades do laboratorio.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value.toLocaleString("pt-BR")}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-950">
            Operacao do estoque
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Esta area recebera indicadores, alertas de reposicao e resumo das
            movimentacoes quando os dados forem integrados nas proximas etapas.
          </p>
        </article>

        <article className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Proxima etapa
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Estruturar o modelo de dados e preparar o cadastro de componentes
            sem comprometer a simplicidade da interface.
          </p>
        </article>
      </div>
    </section>
  );
}
