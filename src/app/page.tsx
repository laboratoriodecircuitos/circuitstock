import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function getMovementLabel(type: string) {
  if (type === "ENTRY") {
    return "Entrada";
  }

  if (type === "EXIT") {
    return "Saida";
  }

  return "Ajuste";
}

function getMovementBadgeClass(type: string) {
  if (type === "ENTRY") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (type === "EXIT") {
    return "bg-rose-100 text-rose-800";
  }

  return "bg-sky-100 text-sky-800";
}

function formatVariation(quantity: number) {
  const formatted = Math.abs(quantity).toLocaleString("pt-BR");

  if (quantity > 0) {
    return `+${formatted}`;
  }

  if (quantity < 0) {
    return `-${formatted}`;
  }

  return "0";
}

async function getDashboardData() {
  await connection();

  const [
    totalComponents,
    totalCategories,
    totalLocations,
    lowStockItems,
    activeProjects,
    stockQuantity,
    zeroStockItems,
    lowStockComponents,
    latestMovements,
    latestComponents,
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
    prisma.component.aggregate({
      _sum: {
        quantity: true,
      },
    }),
    prisma.component.count({
      where: {
        quantity: 0,
      },
    }),
    prisma.component.findMany({
      where: {
        quantity: {
          lte: prisma.component.fields.minimumQuantity,
        },
      },
      orderBy: [
        {
          quantity: "asc",
        },
        {
          minimumQuantity: "desc",
        },
        {
          name: "asc",
        },
      ],
      take: 5,
      select: {
        id: true,
        name: true,
        quantity: true,
        minimumQuantity: true,
        category: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.stockMovement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        type: true,
        quantity: true,
        reason: true,
        createdAt: true,
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.component.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        quantity: true,
        minimumQuantity: true,
        category: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const stats = [
    { label: "Total de componentes", value: totalComponents },
    { label: "Categorias", value: totalCategories },
    { label: "Localizacoes", value: totalLocations },
    { label: "Itens em baixa", value: lowStockItems },
    { label: "Projetos ativos", value: activeProjects },
  ];

  const stockSummary = [
    {
      label: "Quantidade em estoque",
      value: stockQuantity._sum.quantity ?? 0,
    },
    {
      label: "Componentes zerados",
      value: zeroStockItems,
    },
  ];

  return { stats, stockSummary, lowStockComponents, latestMovements, latestComponents };
}

export default async function Dashboard() {
  const {
    stats,
    stockSummary,
    lowStockComponents,
    latestMovements,
    latestComponents,
  } = await getDashboardData();

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
          Painel operacional para acompanhar o inventario, pontos de atencao e
          movimentacoes recentes do laboratorio.
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {stockSummary.map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {item.value.toLocaleString("pt-BR")}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Itens em baixa
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Componentes com quantidade menor ou igual ao estoque minimo.
              </p>
            </div>
            <Link
              href="/componentes?stockStatus=low"
              className="shrink-0 text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          {lowStockComponents.length === 0 ? (
            <div className="mt-5 rounded-md border border-dashed border-slate-300 p-4">
              <p className="text-sm font-medium text-slate-950">
                Nenhum item em baixa agora.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Quando um componente atingir o estoque minimo, ele aparecera
                aqui.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-200">
              {lowStockComponents.map((component) => (
                <article
                  key={component.id}
                  className="grid grid-cols-1 gap-3 py-4 text-sm sm:grid-cols-12 sm:items-center"
                >
                  <div className="sm:col-span-5">
                    <Link
                      href={`/componentes/${component.id}`}
                      className="font-medium text-slate-950 hover:text-cyan-800 hover:underline"
                    >
                      {component.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {component.category.name} | {component.location.name}
                    </p>
                  </div>
                  <p className="text-slate-600 sm:col-span-3 sm:text-right">
                    Qtd.{" "}
                    <span className="font-medium text-slate-950">
                      {component.quantity.toLocaleString("pt-BR")}
                    </span>
                  </p>
                  <p className="text-slate-600 sm:col-span-3 sm:text-right">
                    Min.{" "}
                    <span className="font-medium text-slate-950">
                      {component.minimumQuantity.toLocaleString("pt-BR")}
                    </span>
                  </p>
                  <p className="sm:col-span-1 sm:text-right">
                    <Link
                      href={`/componentes/${component.id}`}
                      className="text-xs font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
                    >
                      Detalhes
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Ultimas movimentacoes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Entradas, saidas e ajustes mais recentes do estoque.
              </p>
            </div>
            <Link
              href="/movimentacoes"
              className="shrink-0 text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
            >
              Ver historico
            </Link>
          </div>

          {latestMovements.length === 0 ? (
            <div className="mt-5 rounded-md border border-dashed border-slate-300 p-4">
              <p className="text-sm font-medium text-slate-950">
                Nenhuma movimentacao registrada ainda.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Entradas, saidas e ajustes aparecerao aqui quando forem
                registrados.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-200">
              {latestMovements.map((movement) => (
                <article
                  key={movement.id}
                  className="grid grid-cols-1 gap-3 py-4 text-sm sm:grid-cols-12 sm:items-center"
                >
                  <div className="sm:col-span-4">
                    <Link
                      href={`/componentes/${movement.component.id}`}
                      className="font-medium text-slate-950 hover:text-cyan-800 hover:underline"
                    >
                      {movement.component.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {dateTimeFormatter.format(movement.createdAt)}
                    </p>
                  </div>
                  <p className="sm:col-span-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getMovementBadgeClass(
                        movement.type,
                      )}`}
                    >
                      {getMovementLabel(movement.type)}
                    </span>
                  </p>
                  <p className="font-medium text-slate-950 sm:col-span-2 sm:text-right">
                    {formatVariation(movement.quantity)}
                  </p>
                  <p className="text-slate-600 sm:col-span-4">
                    {movement.reason ?? "-"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Ultimos componentes cadastrados
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Itens adicionados recentemente ao inventario.
            </p>
          </div>
          <Link
            href="/componentes"
            className="shrink-0 text-sm font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
          >
            Ver componentes
          </Link>
        </div>

        {latestComponents.length === 0 ? (
          <div className="mt-5 rounded-md border border-dashed border-slate-300 p-4">
            <p className="text-sm font-medium text-slate-950">
              Nenhum componente cadastrado ainda.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Quando o cadastro inicial for usado, os componentes mais recentes
              aparecerao aqui.
            </p>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-slate-200">
            {latestComponents.map((component) => {
              const isLowStock =
                component.quantity <= component.minimumQuantity;

              return (
                <article
                  key={component.id}
                  className="grid grid-cols-1 gap-3 py-4 text-sm sm:grid-cols-12 sm:items-center"
                >
                  <div className="sm:col-span-4">
                    <Link
                      href={`/componentes/${component.id}`}
                      className="font-medium text-slate-950 hover:text-cyan-800 hover:underline"
                    >
                      {component.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {component.category.name} | {component.location.name}
                    </p>
                  </div>
                  <p className="text-slate-600 sm:col-span-2 sm:text-right">
                    Qtd.{" "}
                    <span className="font-medium text-slate-950">
                      {component.quantity.toLocaleString("pt-BR")}
                    </span>
                  </p>
                  <p className="sm:col-span-2 sm:text-right">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                        isLowStock
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isLowStock ? "Em baixa" : "OK"}
                    </span>
                  </p>
                  <p className="sm:col-span-4 sm:text-right">
                    <Link
                      href={`/componentes/${component.id}`}
                      className="text-xs font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
