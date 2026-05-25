import { connection } from "next/server";
import { createStockMovement } from "@/app/movimentacoes/actions";
import { prisma } from "@/lib/prisma";

type MovimentacoesSearchParams = {
  created?: string | string[];
  unchanged?: string | string[];
  error?: string | string[];
};

type MovimentacoesPageProps = {
  searchParams?: Promise<MovimentacoesSearchParams>;
};

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function getSingleParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
}

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

async function getMovimentacoesPageData() {
  await connection();

  const [components, movements] = await Promise.all([
    prisma.component.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        value: true,
        quantity: true,
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
      select: {
        id: true,
        type: true,
        quantity: true,
        reason: true,
        createdAt: true,
        component: {
          select: {
            name: true,
            value: true,
          },
        },
      },
    }),
  ]);

  return { components, movements };
}

export default async function MovimentacoesPage({
  searchParams,
}: MovimentacoesPageProps) {
  const params = await searchParams;
  const feedback = {
    created: getSingleParam(params?.created),
    unchanged: getSingleParam(params?.unchanged),
    error: getSingleParam(params?.error),
  };
  const { components, movements } = await getMovimentacoesPageData();
  const canCreateMovement = components.length > 0;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Estoque
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Movimentacoes
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Registre entradas, saidas e ajustes manuais com motivo obrigatorio
            para manter o historico do estoque.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Historico
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {movements.length.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {(feedback.created || feedback.unchanged || feedback.error) && (
        <div
          className={`mt-6 rounded-md border p-4 text-sm ${
            feedback.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.error ||
            (feedback.unchanged
              ? "Nenhuma alteracao registrada: a quantidade final informada ja era a quantidade atual."
              : "Movimentacao registrada com sucesso.")}
        </div>
      )}

      <form
        action={createStockMovement}
        className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Nova movimentacao
          </h2>
          <p className="text-sm text-slate-600">
            Entrada adiciona quantidade ao estoque. Saida remove quantidade do
            estoque. Ajuste define a quantidade final real encontrada.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-12">
          <label className="lg:col-span-5">
            <span className="text-sm font-medium text-slate-700">
              Componente
            </span>
            <select
              required
              name="componentId"
              defaultValue=""
              disabled={!canCreateMovement}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="" disabled>
                Selecione
              </option>
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                  {component.value ? ` - ${component.value}` : ""} | Qtd.{" "}
                  {component.quantity.toLocaleString("pt-BR")} |{" "}
                  {component.category.name} | {component.location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-3">
            <span className="text-sm font-medium text-slate-700">Tipo</span>
            <select
              required
              name="type"
              defaultValue="ENTRY"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="ENTRY">Entrada</option>
              <option value="EXIT">Saida</option>
              <option value="ADJUSTMENT">Ajuste</option>
            </select>
          </label>

          <label className="lg:col-span-4">
            <span className="text-sm font-medium text-slate-700">
              Quantidade
            </span>
            <input
              required
              min={0}
              step={1}
              name="quantity"
              type="number"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="lg:col-span-12">
            <span className="text-sm font-medium text-slate-700">
              Motivo
            </span>
            <textarea
              required
              name="reason"
              rows={3}
              placeholder="Ex.: reposicao, uso em bancada, inventario fisico..."
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
        </div>

        {!canCreateMovement && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Cadastre pelo menos um componente antes de registrar movimentacoes.
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={!canCreateMovement}
            className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Registrar movimentacao
          </button>
        </div>
      </form>

      {movements.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-medium text-slate-950">
            Nenhuma movimentacao registrada ainda.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Entradas iniciais, saidas e ajustes manuais aparecerao aqui em ordem
            cronologica inversa.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span className="col-span-2">Data/hora</span>
            <span className="col-span-3">Componente</span>
            <span className="col-span-2">Tipo</span>
            <span className="col-span-1 text-right">Variacao</span>
            <span className="col-span-4">Motivo</span>
          </div>

          <div className="divide-y divide-slate-200">
            {movements.map((movement) => (
              <article
                key={movement.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 text-sm sm:grid-cols-12 sm:items-center"
              >
                <p className="text-slate-600 sm:col-span-2">
                  {dateTimeFormatter.format(movement.createdAt)}
                </p>
                <div className="sm:col-span-3">
                  <h2 className="font-medium text-slate-950">
                    {movement.component.name}
                  </h2>
                  {movement.component.value && (
                    <p className="mt-1 text-xs text-slate-500">
                      {movement.component.value}
                    </p>
                  )}
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
                <p className="font-medium text-slate-950 sm:col-span-1 sm:text-right">
                  {formatVariation(movement.quantity)}
                </p>
                <p className="text-slate-600 sm:col-span-4">
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
