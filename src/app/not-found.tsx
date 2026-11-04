import Link from "next/link";

import { ArrowRight } from "@/components/Icons";
import { Shell } from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink pt-32 pb-20 text-white">
        <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <p className="eyebrow text-gold">Fout 404</p>
          <h1 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
            Deze pagina is <em>van de baan</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-fog">
            De pagina die u zoekt, bestaat niet of is verhuisd. Misschien is de wagen die u zocht ondertussen verkocht.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/aanbod" className="btn btn-gold">
              Bekijk het aanbod <ArrowRight size={18} />
            </Link>
            <Link href="/" className="btn btn-ghost">
              Naar de homepagina
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
