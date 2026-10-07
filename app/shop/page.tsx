import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Frame, StudioTaskbar } from "../components/Shell";
import { Rise, FlipIn, WaveTitle } from "../components/Motion";
import Image from "next/image";
import { CLIENT_WORK, LINKS, PRODUCTS, SERVICES, STORE_URL, type Product } from "../lib/data";
import { SITE_URL } from "../lib/site";

// One shot per store family; counts include variants and must match studio/store/lib/templates.ts.
const TEMPLATE_SHOTS = [
  ["poster", "Poster", "Headline", 6], ["press", "Riso", "Print shop", 6], ["broadsheet", "Front page", "Editorial", 2],
  ["terminal", "Terminal", "Screen", 5], ["marquee", "Marquee", "Objects", 4], ["confetti", "Carnival", "Party and paper", 2],
] as const;

export const metadata: Metadata = {
  title: "Shop | Wasif Zaman",
  description: "Ready-made creator sites, websites in a week, and stream clipping. Everything Wasif Zaman sells, in one place.",
  alternates: { canonical: `${SITE_URL}/shop` },
};

const fileName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const ask = (name: string) => `mailto:${LINKS.email}?subject=${encodeURIComponent(name + " enquiry")}`;

const STUDIO: Product[] = SERVICES.map((s) => ({
  name: s.name,
  price: s.price,
  priceNote: s.priceNote ?? "",
  blurb: s.outcome,
  includes: s.includes,
  cta: s.price === "Quoted" ? "Get a quote" : "Start this build",
  href: "/studio#packages",
}));

function Card({ p, featured }: { p: Product; featured?: boolean }) {
  const href = p.buy || p.href || ask(p.name);
  const external = href.startsWith("http");
  return (
    <Frame title={`${fileName(p.name)}.md`} active={featured}>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="display text-2xl text-paper md:text-3xl">{p.name}</h3>
        <span className={`display mt-5 text-4xl md:text-5xl ${featured ? "text-acid" : "text-paper"}`}>{p.price}</span>
        {p.priceNote && <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">{p.priceNote}</p>}
        <p className="mt-6 text-sm leading-relaxed text-muted">{p.blurb}</p>
        <ul className="mt-8 flex flex-1 flex-col gap-3">
          {p.includes.map((i) => (
            <li key={i} className="flex gap-3 text-sm text-muted">
              <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-acid" />
              {i}
            </li>
          ))}
        </ul>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          className={`mt-10 border px-6 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
            featured
              ? "border-acid bg-acid text-black hover:bg-transparent hover:text-acid"
              : "border-[color:var(--line-strong)] text-paper hover:border-acid hover:text-acid"
          }`}
        >
          {p.cta}
        </a>
      </div>
    </Frame>
  );
}

function Shelf({ id, title, items }: { id: string; title: string; items: Product[] }) {
  return (
    <section id={id} className="rule px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <Rise className="mb-12">
          <h2 className="display text-[clamp(2rem,5vw,3.6rem)] text-paper">{title}</h2>
        </Rise>
        <FlipIn className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((p, i) => (
            <Card key={p.name} p={p} featured={i === 0} />
          ))}
        </FlipIn>
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <section className="relative overflow-hidden px-6">
        <div className="relative mx-auto flex min-h-[60dvh] w-full max-w-7xl flex-col justify-center pb-16 pt-16">
          <WaveTitle
            className="display text-[clamp(4rem,15vw,15rem)] leading-[0.82] text-paper"
            lines={[[{ t: "Things I " }], [{ t: "sell", c: "text-acid" }]]}
          />
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted md:text-xl">
            Ready-made sites for streamers, websites for busy businesses, and clipping for creators.
            One place, one person to talk to.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.14em]">
            <a href="#creators" className="border border-acid bg-acid px-8 py-4 text-black transition-transform hover:-translate-y-1">
              For creators
            </a>
            <a href="#business" className="border border-[color:var(--line-strong)] px-8 py-4 text-paper transition-colors hover:border-acid hover:text-acid">
              For businesses
            </a>
          </div>
        </div>
      </section>

      <section className="rule overflow-hidden px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <Rise>
            <p className="mono-label text-acid">Live now · for streamers</p>
            <h2 className="display mt-5 text-[clamp(3.2rem,6.4vw,6.6rem)] leading-[0.85] text-paper">
              Larpers<span className="text-acid">Hub</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Sign in with Twitch, pick a template, and your live player, clips and links are on one page.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 border-y border-[color:var(--line-strong)]">
              {[["21", "templates"], ["4", "variants"], ["$0", "in beta"]].map(([n, l]) => (
                <div key={l} className="py-5 pr-4 [&+&]:border-l [&+&]:border-[color:var(--line)] [&+&]:pl-4">
                  <dt className="display text-5xl text-acid md:text-6xl">{n}</dt>
                  <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{l}</dd>
                </div>
              ))}
            </dl>
            <a
              href={STORE_URL}
              className="mt-10 inline-block border border-acid bg-acid px-8 py-4 font-mono text-xs uppercase tracking-[0.14em] text-black shadow-[6px_6px_0_0_var(--paper)] transition-transform hover:-translate-y-1"
            >
              Open the store →
            </a>
          </Rise>
          <a href={STORE_URL} aria-label="See every LarpersHub template" className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {TEMPLATE_SHOTS.map(([key, name, family, looks], i) => (
              <figure
                key={key}
                className="border border-[color:var(--line-strong)] bg-paper p-1.5 shadow-[5px_5px_0_0_var(--acid)]"
                style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1][i]}deg)` }}
              >
                <Image src={`/shop/${key}.webp`} alt={`The ${name} template`} width={400} height={250} className="block aspect-[8/5] w-full object-cover object-top" />
                <figcaption className="flex justify-between gap-2 px-1 pb-0.5 pt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-black">
                  <span>{family}</span>
                  <span className="opacity-60">{looks} looks</span>
                </figcaption>
              </figure>
            ))}
          </a>
        </div>
      </section>

      <Shelf id="creators" title="For creators" items={PRODUCTS} />
      <Shelf id="business" title="For businesses" items={STUDIO} />

      <section className="rule px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Rise className="mb-12">
            <h2 className="display text-[clamp(2rem,5vw,3.6rem)] text-paper">Built for clients</h2>
          </Rise>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CLIENT_WORK.map((c) => (
              <li key={c.name}>
                <a href={c.href} target="_blank" rel="noreferrer noopener" className="group block">
                  <Frame title={c.href.replace(/^https:\/\//, "")}>
                    <div className="p-8">
                      <h3 className="display text-2xl text-paper group-hover:text-acid md:text-3xl">{c.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{c.what}</p>
                    </div>
                  </Frame>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-mono text-[11px] leading-relaxed text-faint">
            Engineering work lives on the <Link href="/" className="text-acid hover:underline">desktop</Link>.
          </p>
        </div>
      </section>

      <Footer />
      <StudioTaskbar />
    </main>
  );
}
