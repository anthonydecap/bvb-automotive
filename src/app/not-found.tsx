import Link from "next/link";

import { ArrowRight } from "@/components/Icons";
import { PhotoStrip } from "@/components/PhotoStrip";
import { Reveal } from "@/components/Reveal";
import { Shell } from "@/components/Shell";
import { mainImage } from "@/lib/cars";
import { getCars } from "@/lib/content";

export default async function NotFound() {
  const stock = (await getCars())
    .map(mainImage)
    .filter((i) => i?.url)
    .slice(0, 24);
  return (
    <Shell>
      <section className="bg-night pt-32 pb-[var(--section)] text-chalk lg:pt-40">
        <Reveal className="frame">
          <h1 className="speed page-title">Deze pagina is van de baan</h1>
          <p className="mt-8 max-w-[46ch] text-lead">
            Ze bestaat niet of is verhuisd. Misschien is de wagen die u zocht ondertussen verkocht.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/aanbod" className="btn btn-gold">
              Bekijk het aanbod <ArrowRight size={18} className="arrow" />
            </Link>
            <Link href="/" className="link">
              Naar de homepagina
            </Link>
          </div>
        </Reveal>
        <PhotoStrip images={stock} className="mt-[var(--section)]" />
      </section>
    </Shell>
  );
}
