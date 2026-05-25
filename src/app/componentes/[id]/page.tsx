import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

type ComponenteDetalhePageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">
        {value === null || value === undefined || value === "" ? "-" : value}
      </dd>
    </div>
  );
}

async function getComponentDetail(id: string) {
  await connection();

  return prisma.component.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      value: true,
      unit: true,
      packageType: true,
      quantity: true,
      minimumQuantity: true,
      manufacturer: true,
      partNumber: true,
      datasheetUrl: true,
      purchaseUrl: true,
      notes: true,
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
      stockMovements: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          type: true,
          quantity: true,
          reason: true,
          createdAt: true,
        },
      },
    },
  });
}

export default async function ComponenteDetalhePage({
  params,
}: ComponenteDetalhePageProps) {
  const { id } = await params;
  const component = await getComponentDetail(id);

  if (!component) {
    notFound();
  }

  const isLowStock = component.quantity <= component.minimumQuantity;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Inventario
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {component.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Ficha do componente com dados principais e historico de
            movimentacoes de estoque.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/componentes"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Voltar para Componentes
          </Link>
          <Link
            href={`/componentes/${component.id}/editar`}
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
          >
            Editar componente
          </Link>
          <Link
            href="/movimentacoes"
            className="inline-flex rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800"
          >
            Ir para Movimentacoes
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Quantidade atual
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {component.quantity.toLocaleString("pt-BR")}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Estoque minimo</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {component.minimumQuantity.toLocaleString("pt-BR")}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Status</p>
          <p className="mt-5">
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
        <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Movimentacoes</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {component.stockMovements.length.toLocaleString("pt-BR")}
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Dados principais
          </h2>
          <p className="text-sm text-slate-600">
            Informacoes cadastrais e tecnicas usadas para identificar o
            componente no laboratorio.
          </p>
        </div>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Descricao" value={component.description} />
          <Field label="Categoria" value={component.category.name} />
          <Field label="Localizacao" value={component.location.name} />
          <Field label="Valor" value={component.value} />
          <Field label="Unidade" value={component.unit} />
          <Field label="Encapsulamento" value={component.packageType} />
          <Field label="Fabricante" value={component.manufacturer} />
          <Field label="Part number" value={component.partNumber} />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Datasheet
            </dt>
            <dd className="mt-1 text-sm">
              {component.datasheetUrl ? (
                <a
                  href={component.datasheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
                >
                  Abrir link
                </a>
              ) : (
                <span className="text-slate-800">-</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Compra
            </dt>
            <dd className="mt-1 text-sm">
              {component.purchaseUrl ? (
                <a
                  href={component.purchaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
                >
                  Abrir link
                </a>
              ) : (
                <span className="text-slate-800">-</span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Field label="Observacoes" value={component.notes} />
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-slate-950">
          Historico de movimentacoes
        </h2>
        <p className="text-sm text-slate-600">
          Entradas, saidas e ajustes registrados para este componente.
        </p>
      </div>

      {component.stockMovements.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Este componente ainda nao possui movimentacoes registradas.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Quando houver entrada inicial, saida ou ajuste manual, o historico
            deste componente aparecera aqui.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-3">Data/hora</span>
            <span className="col-span-2">Tipo</span>
            <span className="col-span-2 text-right">Variacao</span>
            <span className="col-span-5">Motivo</span>
          </div>

          <div className="divide-y divide-slate-200">
            {component.stockMovements.map((movement) => (
              <article
                key={movement.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-center"
              >
                <p className="text-slate-600 sm:col-span-3">
                  {dateTimeFormatter.format(movement.createdAt)}
                </p>
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
                <p className="text-slate-600 sm:col-span-5">
                  {movement.reason ?? "-"}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
