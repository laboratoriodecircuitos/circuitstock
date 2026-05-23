import Link from "next/link";
import { connection } from "next/server";
import { DeleteComponentButton } from "@/app/componentes/_components/delete-component-button";
import { createComponent } from "@/app/componentes/actions";
import { prisma } from "@/lib/prisma";

type ComponentesPageProps = {
  searchParams?: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

async function getComponentPageData() {
  await connection();

  const [components, categories, locations] = await Promise.all([
    prisma.component.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        value: true,
        packageType: true,
        manufacturer: true,
        partNumber: true,
        datasheetUrl: true,
        purchaseUrl: true,
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
  ]);

  return { components, categories, locations };
}

export default async function ComponentesPage({
  searchParams,
}: ComponentesPageProps) {
  const [{ components, categories, locations }, params] = await Promise.all([
    getComponentPageData(),
    searchParams,
  ]);

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
  const canCreateComponent = categories.length > 0 && locations.length > 0;

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

        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Cadastro inicial
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Exclusao segura bloqueia itens com historico de estoque.
          </p>
        </div>
      </div>

      {(params?.created || params?.updated || params?.deleted || params?.error) && (
        <div
          className={`mt-6 rounded-md border p-4 text-sm ${
            params.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {params.error ??
            (params.updated
              ? "Componente atualizado com sucesso."
              : params.deleted
                ? "Componente excluido com sucesso."
                : "Componente cadastrado com sucesso.")}
        </div>
      )}

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

      <form
        action={createComponent}
        className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Novo componente
          </h2>
          <p className="text-sm text-slate-600">
            Cadastre os dados essenciais do componente para iniciar o controle
            de estoque.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">Nome</span>
            <input
              required
              name="name"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">
              Categoria
            </span>
            <select
              required
              name="categoryId"
              defaultValue=""
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="" disabled>
                Selecione
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">
              Localização
            </span>
            <select
              required
              name="locationId"
              defaultValue=""
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="" disabled>
                Selecione
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-12">
            <span className="text-sm font-medium text-slate-700">
              Descrição
            </span>
            <textarea
              name="description"
              rows={2}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">Valor</span>
            <input
              name="value"
              type="text"
              placeholder="10k, 100nF, 5V"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">Unidade</span>
            <input
              name="unit"
              type="text"
              placeholder="ohm, uF, V"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Encapsulamento
            </span>
            <input
              name="packageType"
              type="text"
              placeholder="THT, SMD 0805, DIP"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Quantidade
            </span>
            <input
              required
              min={0}
              step={1}
              name="quantity"
              type="number"
              defaultValue={0}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Fabricante
            </span>
            <input
              name="manufacturer"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Part number
            </span>
            <input
              name="partNumber"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Link do datasheet
            </span>
            <input
              name="datasheetUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Link de compra
            </span>
            <input
              name="purchaseUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Estoque mínimo
            </span>
            <input
              required
              min={0}
              step={1}
              name="minimumQuantity"
              type="number"
              defaultValue={0}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-9">
            <span className="text-sm font-medium text-slate-700">
              Observações
            </span>
            <input
              name="notes"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        {!canCreateComponent && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Cadastre categorias e localizações antes de criar componentes.
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={!canCreateComponent}
            className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Cadastrar componente
          </button>
        </div>
      </form>

      {components.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhum componente cadastrado ainda.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Quando novos componentes forem cadastrados, eles aparecerão aqui com
            categoria, localização, quantidade e estoque mínimo.
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
                    {(component.manufacturer || component.partNumber) && (
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {[component.manufacturer, component.partNumber]
                          .filter(Boolean)
                          .join(" | ")}
                      </span>
                    )}
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
                  {(component.manufacturer ||
                    component.partNumber ||
                    component.datasheetUrl ||
                    component.purchaseUrl) && (
                    <dl className="grid gap-3 rounded-md bg-slate-50 p-3 text-xs sm:col-span-12 sm:grid-cols-4">
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-slate-500">
                          Fabricante
                        </dt>
                        <dd className="mt-1 text-slate-700">
                          {component.manufacturer ?? "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-slate-500">
                          Part number
                        </dt>
                        <dd className="mt-1 text-slate-700">
                          {component.partNumber ?? "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-slate-500">
                          Datasheet
                        </dt>
                        <dd className="mt-1">
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
                            <span className="text-slate-700">-</span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium uppercase tracking-wide text-slate-500">
                          Compra
                        </dt>
                        <dd className="mt-1">
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
                            <span className="text-slate-700">-</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  )}
                  <div className="flex flex-wrap justify-end gap-2 sm:col-span-12">
                    <Link
                      href={`/componentes/${component.id}/editar`}
                      className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
                    >
                      Editar
                    </Link>
                    <DeleteComponentButton
                      componentId={component.id}
                      componentName={component.name}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
