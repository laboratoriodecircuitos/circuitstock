type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
          CircuitStock
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-white p-6">
        <p className="text-sm font-medium text-slate-950">
          Funcionalidade planejada
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta tela sera implementada em etapas futuras, mantendo a base atual
          focada na estrutura visual e na navegacao do sistema.
        </p>
      </div>
    </section>
  );
}
