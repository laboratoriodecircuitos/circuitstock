import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function getComponents() {
  await connection();

  return prisma.component.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      value: true,
      packageType: true,
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
  });
}

export default async function ComponentesPage() {
  const components = await getComponents();
  const lowStockItems = components.filter(
    (component) => component.quantity <= component.minimumQuantity,
  ).length;
  const totalQuantity = components.reduce(
    (total, component) => total + component.quantity,
    0,
  );
  const usedCategories = new Set(
    components.map((component) => component.category.name),
  ).size;

  const summary = [
    { label: "Total de componentes", value: components.length },
    { label: "Itens em baixa", value: lowStockItems },
    { label: "Quantidade em estoque", value: totalQuantity },
    { label: "Categorias usadas", value: usedCategories },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Inventario
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Componentes
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Consulte os componentes cadastrados, suas quantidades e onde estão
            armazenados.
          </p>
        </div>

        <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Cadastro futuro
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Formulários serão adicionados em etapa posterior.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {item.value.toLocaleString("pt-BR")}
            </p>
          </article>
        ))}
      </div>

      {components.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhum componente cadastrado ainda.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Quando o cadastro for implementado, os componentes aparecerão aqui
            com categoria, localização, quantidade e estoque mínimo.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-3">Nome</span>
            <span className="col-span-2">Categoria</span>
            <span className="col-span-2">Localização</span>
            <span className="col-span-1">Valor</span>
            <span className="col-span-1">Encaps.</span>
            <span className="col-span-1 text-right">Qtd.</span>
            <span className="col-span-1 text-right">Mín.</span>
            <span className="col-span-1 text-right">Status</span>
          </div>

          <div className="divide-y divide-slate-200">
            {components.map((component) => {
              const isLowStock =
                component.quantity <= component.minimumQuantity;

              return (
                <article
                  key={component.id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-center"
                >
                  <h2 className="font-medium text-slate-950 sm:col-span-3">
                    {component.name}
                  </h2>
                  <p className="text-slate-600 sm:col-span-2">
                    {component.category.name}
                  </p>
                  <p className="text-slate-600 sm:col-span-2">
                    {component.location.name}
                  </p>
                  <p className="text-slate-600 sm:col-span-1">
                    {component.value ?? "-"}
                  </p>
                  <p className="text-slate-600 sm:col-span-1">
                    {component.packageType ?? "-"}
                  </p>
                  <p className="font-medium text-slate-950 sm:col-span-1 sm:text-right">
                    {component.quantity.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-slate-600 sm:col-span-1 sm:text-right">
                    {component.minimumQuantity.toLocaleString("pt-BR")}
                  </p>
                  <p className="sm:col-span-1 sm:text-right">
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
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
