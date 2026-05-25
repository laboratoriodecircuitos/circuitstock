import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { updateCategory } from "@/app/categorias/actions";
import { prisma } from "@/lib/prisma";

type EditarCategoriaPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

function getSingleParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
}

async function getEditPageData(id: string) {
  await connection();

  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          components: true,
        },
      },
    },
  });
}

export default async function EditarCategoriaPage({
  params,
  searchParams,
}: EditarCategoriaPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const category = await getEditPageData(id);
  const error = getSingleParam(query?.error);

  if (!category) {
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
            Editar categoria
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Atualize nome e descricao da categoria sem alterar os componentes
            vinculados.
          </p>
        </div>

        <Link
          href="/categorias"
          className="inline-flex w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
        >
          Voltar para categorias
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        action={updateCategory}
        className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input name="id" type="hidden" defaultValue={category.id} />

        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Dados da categoria
          </h2>
          <p className="text-sm text-slate-600">
            Esta categoria possui{" "}
            {category._count.components.toLocaleString("pt-BR")} componente
            {category._count.components === 1 ? "" : "s"} vinculado
            {category._count.components === 1 ? "" : "s"}.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">Nome</span>
            <input
              required
              name="name"
              type="text"
              defaultValue={category.name}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-8">
            <span className="text-sm font-medium text-slate-700">
              Descricao
            </span>
            <input
              name="description"
              type="text"
              defaultValue={category.description ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/categorias"
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
