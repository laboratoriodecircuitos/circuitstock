import Link from "next/link";
import { connection } from "next/server";
import { applyAuditAdjustment } from "@/app/auditoria/actions";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type AuditoriaSearchParams = {
  categoryId?: string | string[];
  locationId?: string | string[];
  adjusted?: string | string[];
  unchanged?: string | string[];
  message?: string | string[];
  error?: string | string[];
};

type AuditoriaPageProps = {
  searchParams?: Promise<AuditoriaSearchParams>;
};

type AuditFilters = {
  categoryId: string;
  locationId: string;
};

function getSingleParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
}

function getFilters(params?: AuditoriaSearchParams): AuditFilters {
  return {
    categoryId: getSingleParam(params?.categoryId),
    locationId: getSingleParam(params?.locationId),
  };
}

function hasActiveFilters(filters: AuditFilters) {
  return Boolean(filters.categoryId || filters.locationId);
}

function buildComponentWhere(filters: AuditFilters): Prisma.ComponentWhereInput {
  const where: Prisma.ComponentWhereInput = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.locationId) {
    where.locationId = filters.locationId;
  }

  return where;
}

async function getAuditPageData(filters: AuditFilters) {
  await connection();

  const where = buildComponentWhere(filters);

  const [categories, locations, components] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.component.findMany({
      where,
      orderBy: [
        {
          name: "asc",
        },
      ],
      select: {
        id: true,
        name: true,
        value: true,
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

  return { categories, locations, components };
}

export default async function AuditoriaPage({
  searchParams,
}: AuditoriaPageProps) {
  const params = await searchParams;
  const filters = getFilters(params);
  const activeFilters = hasActiveFilters(filters);
  const { categories, locations, components } = await getAuditPageData(filters);
  const feedback = {
    adjusted: getSingleParam(params?.adjusted),
    unchanged: getSingleParam(params?.unchanged),
    message: getSingleParam(params?.message),
    error: getSingleParam(params?.error),
  };

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Estoque
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Auditoria
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Confira quantidades fisicas por categoria ou localizacao e aplique
            ajustes controlados como movimentacoes de estoque.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Componentes na selecao
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {components.length.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {(feedback.adjusted ||
        feedback.unchanged ||
        feedback.error ||
        feedback.message) && (
        <div
          className={`mt-6 rounded-md border p-4 text-sm ${
            feedback.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.error ||
            feedback.message ||
            (feedback.unchanged
              ? "Nenhuma diferenca encontrada para este componente."
              : "Ajuste de auditoria aplicado com sucesso.")}
        </div>
      )}

      <form
        action="/auditoria"
        method="get"
        className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Escopo da conferencia
          </h2>
          <p className="text-sm text-slate-600">
            Selecione uma categoria, uma localizacao ou combine os dois filtros.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <label className="lg:col-span-5">
            <span className="text-sm font-medium text-slate-700">
              Categoria
            </span>
            <select
              name="categoryId"
              defaultValue={filters.categoryId}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-5">
            <span className="text-sm font-medium text-slate-700">
              Localizacao
            </span>
            <select
              name="locationId"
              defaultValue={filters.locationId}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="">Todas</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-end gap-2 lg:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800"
            >
              Filtrar
            </button>
            <Link
              href="/auditoria"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
            >
              Limpar
            </Link>
          </div>
        </div>
      </form>

      {components.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhum componente encontrado para a auditoria atual.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Ajuste os filtros ou cadastre componentes para iniciar uma
            conferencia fisica de estoque.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-3">Componente</span>
            <span className="col-span-2">Categoria</span>
            <span className="col-span-2">Localizacao</span>
            <span className="col-span-1 text-right">Qtd.</span>
            <span className="col-span-1 text-right">Min.</span>
            <span className="col-span-1 text-right">Status</span>
            <span className="col-span-2 text-right">Ajuste</span>
          </div>

          <div className="divide-y divide-slate-200">
            {components.map((component) => {
              const isLowStock =
                component.quantity <= component.minimumQuantity;

              return (
                <article
                  key={component.id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-start"
                >
                  <div className="sm:col-span-3">
                    <Link
                      href={`/componentes/${component.id}`}
                      className="font-medium text-slate-950 hover:text-cyan-800 hover:underline"
                    >
                      {component.name}
                    </Link>
                    {component.value && (
                      <p className="mt-1 text-xs text-slate-500">
                        {component.value}
                      </p>
                    )}
                  </div>
                  <p className="text-slate-600 sm:col-span-2">
                    {component.category.name}
                  </p>
                  <p className="text-slate-600 sm:col-span-2">
                    {component.location.name}
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
                  <form
                    action={applyAuditAdjustment}
                    className="grid gap-3 rounded-md bg-slate-50 p-3 sm:col-span-12 sm:grid-cols-12 sm:items-end"
                  >
                    <input
                      type="hidden"
                      name="componentId"
                      value={component.id}
                    />
                    <input
                      type="hidden"
                      name="categoryId"
                      value={filters.categoryId}
                    />
                    <input
                      type="hidden"
                      name="locationId"
                      value={filters.locationId}
                    />
                    <input
                      type="hidden"
                      name="currentQuantity"
                      value={component.quantity}
                    />

                    <label className="sm:col-span-3">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Quantidade real
                      </span>
                      <input
                        required
                        min={0}
                        step={1}
                        name="actualQuantity"
                        type="number"
                        defaultValue={component.quantity}
                        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                      />
                    </label>

                    <label className="sm:col-span-7">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Motivo da auditoria
                      </span>
                      <input
                        required
                        name="reason"
                        type="text"
                        defaultValue="Ajuste por auditoria fisica de estoque"
                        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                      />
                    </label>

                    <div className="flex justify-end sm:col-span-2">
                      <button
                        type="submit"
                        className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800"
                      >
                        Aplicar ajuste
                      </button>
                    </div>
                  </form>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {!activeFilters && components.length > 0 && (
        <p className="mt-4 text-sm text-slate-600">
          Exibindo todos os componentes. Para uma conferencia mais focada,
          filtre por categoria ou localizacao.
        </p>
      )}
    </section>
  );
}
