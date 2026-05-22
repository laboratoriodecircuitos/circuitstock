import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircuitStock",
  description: "Inventario local para componentes eletronicos de laboratorio.",
};

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/componentes", label: "Componentes" },
  { href: "/categorias", label: "Categorias" },
  { href: "/localizacoes", label: "Localizacoes" },
  { href: "/movimentacoes", label: "Movimentacoes" },
  { href: "/auditoria", label: "Auditoria" },
  { href: "/projetos", label: "Projetos" },
  { href: "/bom-checker", label: "BOM Checker" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 font-sans text-slate-950">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
            <Link href="/" className="block">
              <span className="text-xl font-semibold tracking-tight text-slate-950">
                CircuitStock
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                Inventario de laboratorio
              </span>
            </Link>

            <nav className="mt-8 flex flex-col gap-1" aria-label="Principal">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Base visual pronta para as proximas etapas do inventario.
              </p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
            <header className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
              <Link href="/" className="block">
                <span className="text-lg font-semibold tracking-tight">
                  CircuitStock
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Inventario de laboratorio
                </span>
              </Link>
              <nav
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
                aria-label="Principal"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="shrink-0 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
