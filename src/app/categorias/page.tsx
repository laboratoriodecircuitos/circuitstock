import Link from "next/link";
import { connection } from "next/server";
import { DeleteCategoryButton } from "@/app/categorias/_components/delete-category-button";
import { createCategory } from "@/app/categorias/actions";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type CategoriasSearchParams = {
  created?: string | string[];
  updated?: string | string[];
  deleted?: string | string[];
  error?: string | string[];
};

type CategoriasPageProps = {
  searchParams?: Promise<CategoriasSearchParams>;
};

function getSingleParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
}

async function getCategories() {
  await connection();

  return prisma.category.findMany({
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

export default async function CategoriasPage({
  searchParams,
}: CategoriasPageProps) {
  const [categories, params] = await Promise.all([getCategories(), searchParams]);
  const feedback = {
    created: getSingleParam(params?.created),
    updated: getSingleParam(params?.updated),
    deleted: getSingleParam(params?.deleted),
    error: getSingleParam(params?.error),
  };
  const totalCategories = categories.length;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Inventario
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Categorias
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Organize componentes por tipo para facilitar busca, auditoria e
            controle de estoque.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total cadastrado
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {totalCategories.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {(feedback.created ||
        feedback.updated ||
        feedback.deleted ||
        feedback.error) && (
        <div
          className={`mt-6 rounded-md border p-4 text-sm ${
            feedback.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.error ||
            (feedback.updated
              ? "Categoria atualizada com sucesso."
              : feedback.deleted
                ? "Categoria excluida com sucesso."
                : "Categoria criada com sucesso.")}
        </div>
      )}

      <form
        action={createCategory}
        className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Nova categoria
          </h2>
          <p className="text-sm text-slate-600">
            Crie uma classificacao para organizar componentes por tipo.
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

          <label className="lg:col-span-8">
            <span className="text-sm font-medium text-slate-700">
              Descricao
            </span>
            <input
              name="description"
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800"
          >
            Criar categoria
          </button>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhuma categoria cadastrada
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            As categorias iniciais podem ser carregadas pelo seed do banco
            local.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-4">Categoria</span>
            <span className="col-span-3">Descricao</span>
            <span className="col-span-2 text-right">Componentes</span>
            <span className="col-span-2 text-right">Atualizada em</span>
            <span className="col-span-1 text-right">Acoes</span>
          </div>

          <div className="divide-y divide-slate-200">
            {categories.map((category) => (
              <article
                key={category.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-4">
                  <h2 className="font-medium text-slate-950">
                  {category.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Criada em {dateFormatter.format(category.createdAt)}
                  </p>
                </div>

                <p className="text-slate-600 sm:col-span-3">
                  {category.description ?? "Sem descricao cadastrada"}
                </p>

                <p className="font-medium text-slate-950 sm:col-span-2 sm:text-right">
                  {category._count.components.toLocaleString("pt-BR")}
                </p>

                <p className="text-slate-500 sm:col-span-2 sm:text-right">
                  {dateFormatter.format(category.updatedAt)}
                </p>

                <div className="flex flex-wrap justify-end gap-2 sm:col-span-1">
                  <Link
                    href={`/categorias/${category.id}/editar`}
                    className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
                  >
                    Editar
                  </Link>
                  <DeleteCategoryButton
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
