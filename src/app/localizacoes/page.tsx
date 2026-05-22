import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

async function getLocations() {
  await connection();

  return prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          components: true,
        },
      },
    },
  });
}

export default async function LocalizacoesPage() {
  const locations = await getLocations();
  const totalLocations = locations.length;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Inventario
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Localizações
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Controle onde cada componente fica guardado para facilitar busca,
            auditoria e reposição.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total cadastrado
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {totalLocations.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhuma localização cadastrada
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            As localizações iniciais podem ser carregadas pelo seed do banco
            local.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-5">Localização</span>
            <span className="col-span-3">Descrição</span>
            <span className="col-span-2 text-right">Componentes</span>
            <span className="col-span-2 text-right">Atualizada em</span>
          </div>

          <div className="divide-y divide-slate-200">
            {locations.map((location) => (
              <article
                key={location.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-5">
                  <h2 className="font-medium text-slate-950">
                    {location.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Criada em {dateFormatter.format(location.createdAt)}
                  </p>
                </div>

                <p className="text-slate-600 sm:col-span-3">
                  {location.description ?? "Sem descrição cadastrada"}
                </p>

                <p className="font-medium text-slate-950 sm:col-span-2 sm:text-right">
                  {location._count.components.toLocaleString("pt-BR")}
                </p>

                <p className="text-slate-500 sm:col-span-2 sm:text-right">
                  {dateFormatter.format(location.updatedAt)}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
