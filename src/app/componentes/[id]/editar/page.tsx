import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { updateComponent } from "@/app/componentes/actions";
import { prisma } from "@/lib/prisma";

type EditarComponentePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function getEditPageData(id: string) {
  await connection();

  const [component, categories, locations] = await Promise.all([
    prisma.component.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        locationId: true,
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

  return { component, categories, locations };
}

export default async function EditarComponentePage({
  params,
  searchParams,
}: EditarComponentePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { component, categories, locations } = await getEditPageData(id);

  if (!component) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Inventario
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Editar componente
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Atualize os dados descritivos e tecnicos do componente sem alterar
            diretamente a quantidade em estoque.
          </p>
        </div>

        <Link
          href="/componentes"
          className="inline-flex w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
        >
          Voltar para componentes
        </Link>
      </div>

      {query?.error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {query.error}
        </div>
      )}

      <form
        action={updateComponent}
        className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input name="id" type="hidden" defaultValue={component.id} />

        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Dados do componente
          </h2>
          <p className="text-sm text-slate-600">
            A quantidade atual e exibida apenas para consulta. Ajustes de
            estoque serao tratados por movimentacoes em etapa futura.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">Nome</span>
            <input
              required
              name="name"
              type="text"
              defaultValue={component.name}
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
              defaultValue={component.categoryId}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">
              Localizacao
            </span>
            <select
              required
              name="locationId"
              defaultValue={component.locationId}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-12">
            <span className="text-sm font-medium text-slate-700">
              Descricao
            </span>
            <textarea
              name="description"
              rows={3}
              defaultValue={component.description ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">Valor</span>
            <input
              name="value"
              type="text"
              defaultValue={component.value ?? ""}
              placeholder="10k, 100nF, 5V"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">Unidade</span>
            <input
              name="unit"
              type="text"
              defaultValue={component.unit ?? ""}
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
              defaultValue={component.packageType ?? ""}
              placeholder="THT, SMD 0805, DIP"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <div className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Quantidade atual
            </span>
            <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-950">
              {component.quantity.toLocaleString("pt-BR")}
            </div>
          </div>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">
              Estoque minimo
            </span>
            <input
              required
              min={0}
              step={1}
              name="minimumQuantity"
              type="number"
              defaultValue={component.minimumQuantity}
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
              defaultValue={component.manufacturer ?? ""}
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
              defaultValue={component.partNumber ?? ""}
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
              defaultValue={component.datasheetUrl ?? ""}
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
              defaultValue={component.purchaseUrl ?? ""}
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-12">
            <span className="text-sm font-medium text-slate-700">
              Observacoes
            </span>
            <input
              name="notes"
              type="text"
              defaultValue={component.notes ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/componentes"
            className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800"
          >
            Salvar alteracoes
          </button>
        </div>
      </form>
    </section>
  );
}
