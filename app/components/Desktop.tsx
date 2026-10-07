"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import ArchDiagram from "./ArchDiagram";
import { WaveTitle } from "./Motion";
import { Clock, Tile } from "./Shell";
import { LINKS, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATES, TOOLBOX, STORE_URL, type Project } from "../lib/data";

/** Window position and size as fractions of the viewport. */
type Rect = { x: number; y: number; w: number; h: number };
type Doc = { id: string; folder: string; name: string; project?: Project };

const PROJECTS_WIN: Rect = { x: 0.34, y: 0.28, w: 0.62, h: 0.6 };
const CODE_WIN: Rect = { x: 0.2, y: 0.07, w: 0.66, h: 0.8 };
const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const desktop = () => window.matchMedia("(min-width: 768px)").matches;

const DOCS: Doc[] = [
  ...PROJECTS.map((p) => ({ id: slug(p.title), folder: slug(p.title), name: "README.md", project: p })),
  { id: "experience", folder: "about", name: "experience.md" },
];

function Window({
  id,
  title,
  rect,
  open,
  z,
  front,
  inlineOnPhone = false,
  actions,
  onClose,
  onFocus,
  children,
}: {
  id: string;
  title: string;
  rect: Rect;
  open: boolean;
  z: number;
  front: boolean;
  inlineOnPhone?: boolean;
  actions?: React.ReactNode;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const pos = useRef<{ x: number; y: number } | null>(null);
  const openOnLoad = useRef(open);

  useEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    pos.current ??= { x: rect.x * window.innerWidth, y: rect.y * window.innerHeight };
    el.style.setProperty("--x", `${pos.current.x}px`);
    el.style.setProperty("--y", `${pos.current.y}px`);
    if (openOnLoad.current) {
      openOnLoad.current = false;
      return;
    }
    if (!inlineOnPhone || desktop()) el.focus({ preventScroll: true });
  }, [open, rect, inlineOnPhone]);

  const drag = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || !pos.current || !desktop() || (e.target as HTMLElement).closest("button")) return;
    const bar = e.currentTarget;
    const start = { px: e.clientX, py: e.clientY, ...pos.current };
    bar.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const x = Math.min(Math.max(start.x + ev.clientX - start.px, 120 - el.offsetWidth), window.innerWidth - 120);
      const y = Math.min(Math.max(start.y + ev.clientY - start.py, 0), window.innerHeight - 110);
      pos.current = { x, y };
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };
    const up = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  };

  const phone = inlineOnPhone
    ? `relative mx-5 mt-10 flex ${open ? "" : "md:hidden"}`
    : `fixed inset-x-0 top-0 bottom-12 ${open ? "flex" : "hidden"}`;

  return (
    <section
      ref={ref}
      id={id}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      onPointerDownCapture={() => onFocus(id)}
      onKeyDown={(e) => e.key === "Escape" && !(inlineOnPhone && !desktop()) && onClose(id)}
      style={{ zIndex: 20 + z, "--w": `${rect.w * 100}vw`, "--h": `${rect.h * 100}vh` } as React.CSSProperties}
      className={`${phone} win-open flex-col border border-[color:var(--line-strong)] bg-ink-raised outline-none md:absolute md:inset-auto md:left-0 md:top-0 md:m-0 md:h-[var(--h)] md:w-[var(--w)] md:[translate:var(--x)_var(--y)] ${
        front ? "md:shadow-[8px_8px_0_0_var(--acid)]" : "md:shadow-[8px_8px_0_0_rgba(244,241,234,0.12)]"
      }`}
    >
      <header
        onPointerDown={drag}
        className="flex h-10 shrink-0 select-none items-center justify-between border-b border-[color:var(--line)] bg-ink-sunken pl-3 md:cursor-grab md:active:cursor-grabbing"
      >
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${front ? "text-acid" : "text-muted"}`}>{title}</span>
        <span className="ml-auto flex">{actions}</span>
        <button
          type="button"
          onClick={() => onClose(id)}
          aria-label={`Close ${title}`}
          className={`h-10 w-12 font-mono text-base leading-none text-muted transition-colors hover:bg-[#c42b1c] hover:text-white ${inlineOnPhone ? "hidden md:block" : ""}`}
        >
          ×
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}

function Shot({ p, sizes, priority = false }: { p: Project; sizes: string; priority?: boolean }) {
  return p.imgSrc ? (
    <Image
      src={p.imgSrc}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-105"
    />
  ) : (
    p.arch && <ArchDiagram spec={p.arch} />
  );
}

function Reel({ onOpen, scroller: ref }: { onOpen: (id: string, from: HTMLElement) => void; scroller: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const end = el.scrollWidth - el.clientWidth;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= end - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);

  return (
    <div ref={ref} className="flex h-full snap-x snap-mandatory gap-4 overflow-x-auto p-4 md:gap-5 md:p-5">
      {PROJECTS.map((p, i) => (
        <button
          key={p.title}
          type="button"
          onClick={(e) => onOpen(slug(p.title), e.currentTarget)}
          className="group flex w-[76vw] shrink-0 snap-start flex-col border border-[color:var(--line)] bg-ink text-left transition-colors hover:border-acid md:w-[min(34vw,560px)]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--line)] md:aspect-auto md:min-h-0 md:flex-1">
            <Shot p={p} sizes="(min-width: 768px) 34vw, 76vw" priority={i === 0} />
          </div>
          <div className="flex flex-col gap-2 p-4">
            <h3 className="display text-2xl text-paper">{p.title}</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-acid">{p.blurb}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

type Line = React.ReactNode;

const H1 = (t: string) => <span className="font-semibold text-acid"># {t}</span>;
const H2 = (t: string) => <span className="font-semibold text-acid">## {t}</span>;
const Item = (t: React.ReactNode) => (
  <span className="text-muted">
    <span className="text-acid">- </span>
    {t}
  </span>
);
const MdLink = ({ label, href, download }: { label: string; href: string; download?: boolean }) => (
  <a href={href} target={download ? undefined : "_blank"} rel="noreferrer noopener" download={download} className="group/link">
    <span className="text-faint">[</span>
    <span className="text-paper underline decoration-acid underline-offset-4 group-hover/link:text-acid">{label}</span>
    <span className="text-faint">]({href})</span>
  </a>
);

function readme(p: Project): Line[] {
  const links = [
    p.projectLink && { href: p.projectLink, label: p.projectLabel ?? "Live" },
    p.code && { href: p.code, label: "Code" },
    p.altCode && { href: p.altCode, label: p.altCodeLabel ?? "More code" },
  ].filter(Boolean) as { href: string; label: string }[];
  return [
    H1(p.title),
    "",
    <span key="q" className="italic text-muted">&gt; {p.blurb}</span>,
    "",
    <span key="d" className="text-paper">{p.description}</span>,
    "",
    H2("Stack"),
    ...p.tech.map((t) => Item(t)),
    "",
    H2("Links"),
    ...links.map((l) => Item(<MdLink {...l} />)),
  ];
}

function experience(): Line[] {
  return [
    H1("Experience"),
    ...EXPERIENCE.flatMap((e) => [
      "",
      H2(e.company),
      <span key={e.role} className="text-paper">
        **{e.role}**<span className="text-faint">, {e.period}</span>
      </span>,
      ...e.points.map((pt) => Item(pt)),
    ]),
    "",
    H2("Education"),
    <span key="edu" className="text-paper">
      **{EDUCATION.institution}**<span className="text-faint">, {EDUCATION.period}</span>
    </span>,
    <span key="deg" className="text-muted">{EDUCATION.degree}</span>,
    ...CERTIFICATES.map((c) => Item(`${c.name}, ${c.issuer}`)),
    "",
    H2("Toolbox"),
    <span key="tools" className="text-muted">{TOOLBOX.join(", ")}</span>,
    "",
    Item(<MdLink label="Download the CV" href={LINKS.resume} download />),
  ];
}

function Code({
  tabs,
  active,
  onSelect,
  onCloseTab,
}: {
  tabs: string[];
  active: string;
  onSelect: (id: string) => void;
  onCloseTab: (id: string) => void;
}) {
  const doc = DOCS.find((d) => d.id === active) ?? DOCS[0];
  const lines = doc.project ? readme(doc.project) : experience();
  const folders = [...new Set(DOCS.map((d) => d.folder))];

  return (
    <div className="flex h-full">
      <aside aria-label="Explorer" className="hidden w-48 shrink-0 overflow-auto border-r border-[color:var(--line)] bg-ink-sunken py-3 font-mono text-[12px] md:block">
        <p className="px-4 pb-2 text-[10px] uppercase tracking-[0.16em] text-faint">Portfolio</p>
        {folders.map((f) => (
          <div key={f}>
            <p className="px-4 py-1 text-muted">▾ {f}</p>
            {DOCS.filter((d) => d.folder === f).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(d.id)}
                className={`block w-full py-1 pl-9 pr-3 text-left transition-colors hover:bg-[rgba(244,241,234,0.06)] ${d.id === active ? "bg-[rgba(206,255,26,0.1)] text-acid" : "text-muted"}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        ))}
        <a href={LINKS.resume} download className="block py-1 pl-4 text-muted transition-colors hover:text-acid">
          resume.pdf
        </a>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div role="tablist" className="flex shrink-0 overflow-x-auto border-b border-[color:var(--line)] bg-ink-sunken">
          {[...tabs, ...DOCS.map((d) => d.id).filter((id) => !tabs.includes(id))].map((id) => {
            const d = DOCS.find((x) => x.id === id)!;
            const on = id === active;
            return (
              <div
                key={id}
                className={`flex shrink-0 items-center border-r border-[color:var(--line)] ${on ? "border-t-2 border-t-acid bg-ink-raised" : "border-t-2 border-t-transparent"} ${tabs.includes(id) ? "" : "md:hidden"}`}
              >
                <button role="tab" aria-selected={on} type="button" onClick={() => onSelect(id)} className={`py-2 pl-3 pr-2 font-mono text-[12px] ${on ? "text-paper" : "text-muted"}`}>
                  {d.folder === "about" ? d.name : d.folder}
                  <span className="ml-2 text-faint">{d.folder === "about" ? "" : d.name}</span>
                </button>
                <button type="button" aria-label={`Close ${d.folder}`} onClick={() => onCloseTab(id)} className="mr-1 hidden h-6 w-6 font-mono text-faint hover:text-paper md:block">
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-1 flex-col-reverse overflow-auto lg:flex-row lg:overflow-hidden">
          {DOCS.map((d) => (
            <ol key={d.id} hidden={d.id !== doc.id} className="min-w-0 flex-1 py-4 font-mono text-[13px] leading-6 lg:overflow-auto">
              {(d.project ? readme(d.project) : experience()).map((line, i) => (
                <li key={i} className="grid grid-cols-[3.25rem_1fr] pr-5">
                  <span aria-hidden className="select-none pr-4 text-right text-faint">{i + 1}</span>
                  <span className="whitespace-pre-wrap break-words">{line}</span>
                </li>
              ))}
            </ol>
          ))}
          {doc.project && (
            <div className="group shrink-0 border-b border-[color:var(--line)] p-4 lg:w-[44%] lg:overflow-auto lg:border-b-0 lg:border-l">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Preview</p>
              <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--line)]">
                <Shot p={doc.project} sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              {doc.project.imgNote && <p className="mt-2 font-mono text-[10px] text-faint">{doc.project.imgNote}</p>}
            </div>
          )}
        </div>

        <div role="status" className="flex h-6 shrink-0 items-center justify-between bg-acid px-3 font-mono text-[11px] text-black">
          <span>{doc.folder}/{doc.name}</span>
          <span>{lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}

function Icon({ label, onClick, href, download, children }: {
  label: string;
  onClick?: (from: HTMLElement) => void;
  href?: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden border border-[color:var(--line-strong)] transition-transform group-hover:-translate-y-1 group-hover:border-acid">
        {children}
      </span>
      <span className="line-clamp-2 max-w-24 text-center font-mono text-[10px] uppercase leading-snug tracking-[0.08em] text-muted group-hover:text-paper">{label}</span>
    </>
  );
  const cls = "group flex flex-col items-center gap-2";
  return href ? (
    <a href={href} download={download} className={cls}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={(e) => onClick?.(e.currentTarget)} className={cls}>
      {body}
    </button>
  );
}

export default function Desktop() {
  const [stack, setStack] = useState<string[]>(["projects"]);
  const [tabs, setTabs] = useState<string[]>([DOCS[0].id]);
  const [active, setActive] = useState(DOCS[0].id);
  const [start, setStart] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const name = useRef<HTMLDivElement>(null);
  const startMenu = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);

  const open = (id: string, from?: HTMLElement) => {
    opener.current = from ?? null;
    setStart(false);
    setStack((s) => [...s.filter((x) => x !== id), id]);
  };
  const close = (id: string) => {
    setStack((s) => s.filter((x) => x !== id));
    opener.current?.focus();
  };
  const focus = (id: string) => setStack((s) => (s[s.length - 1] === id || !s.includes(id) ? s : [...s.filter((x) => x !== id), id]));
  const win = (id: string) => ({ id, open: stack.includes(id), z: stack.indexOf(id) + 1, front: stack[stack.length - 1] === id, onClose: close, onFocus: focus });
  const openDoc = (id: string, from?: HTMLElement) => {
    setTabs((t) => (t.includes(id) ? t : [...t, id]));
    setActive(id);
    open("code", from);
  };
  const closeTab = (id: string) => {
    const rest = tabs.filter((t) => t !== id);
    setTabs(rest);
    if (!rest.length) close("code");
    else if (id === active) setActive(rest[rest.length - 1]);
  };
  const toggle = (id: string) => (stack[stack.length - 1] === id ? close(id) : open(id));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        name.current?.querySelectorAll<HTMLElement>(".wave-letter").forEach((l) => {
          const r = l.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          l.style.fontWeight = String(Math.round(300 + 600 * Math.max(0, 1 - d / 320)));
        });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    if (!start) return;
    const away = (e: PointerEvent) => {
      if (!startMenu.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-start]")) setStart(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setStart(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [start]);

  const apps = [
    { id: "projects", label: "Projects", tile: <Tile text="▦" tone="acid" /> },
    { id: "code", label: "Code", tile: <Tile text="</>" tone="ink" /> },
  ];
  const run = (id: string) => (id === "code" && !stack.includes("code") ? openDoc(active) : toggle(id));

  return (
    <div className="relative min-h-[100dvh] bg-ink pb-24 md:h-[100dvh] md:overflow-hidden md:pb-0">
      <div ref={name} className="px-5 pt-10 md:pointer-events-none md:absolute md:left-[3vw] md:top-[5vh] md:p-0">
        <WaveTitle
          className="display text-[clamp(3.5rem,15vw,5rem)] leading-[0.86] text-paper md:text-[10.5vw]"
          lines={[[{ t: "Wasif Zaman" }]]}
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-acid md:mt-5 md:text-sm">
          Software Engineer, Macquarie Honours 2027
        </p>
      </div>

      <Window
        title="Projects"
        rect={PROJECTS_WIN}
        inlineOnPhone
        actions={[-1, 1].map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir < 0 ? "Previous project" : "Next project"}
            onClick={() => {
              const el = reel.current;
              const card = el?.firstElementChild as HTMLElement | null;
              el?.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
            }}
            className="h-10 w-10 font-mono text-base text-muted transition-colors hover:bg-acid hover:text-black"
          >
            {dir < 0 ? "‹" : "›"}
          </button>
        ))}
        {...win("projects")}
      >
        <Reel onOpen={openDoc} scroller={reel} />
      </Window>

      <nav
        aria-label="Desktop"
        className="mt-12 grid grid-cols-4 gap-x-3 gap-y-6 px-5 md:absolute md:left-[3vw] md:top-[31vh] md:mt-0 md:grid-cols-3 md:gap-x-5 md:px-0"
      >
        {PROJECTS.map((p) => (
          <Icon key={p.title} label={p.title} onClick={(from) => openDoc(slug(p.title), from)}>
            {p.imgSrc ? (
              <Image src={p.imgSrc} alt="" fill sizes="64px" className="object-cover object-left-top" />
            ) : (
              <Tile text={p.title.slice(0, 2).toUpperCase()} tone="acid" />
            )}
          </Icon>
        ))}
        <Icon label="Experience" onClick={(from) => openDoc("experience", from)}>
          <Tile text="XP" tone="paper" />
        </Icon>
        <Icon label="Resume.pdf" href={LINKS.resume} download>
          <Tile text="CV" tone="paper" />
        </Icon>
        <Icon label="Shop" href="/shop">
          <Tile text="$" tone="ink" />
        </Icon>
        <Icon label="LarpersHub" href={STORE_URL}>
          <Image src="/shop/poster.webp" alt="" fill sizes="64px" className="object-cover object-left-top" />
        </Icon>
      </nav>

      <Window title="Code" rect={CODE_WIN} {...win("code")}>
        <Code tabs={tabs} active={active} onSelect={(id) => (tabs.includes(id) ? setActive(id) : openDoc(id))} onCloseTab={closeTab} />
      </Window>

      {start && (
        <div
          ref={startMenu}
          role="menu"
          aria-label="Start"
          className="win-open fixed bottom-14 left-1/2 z-[160] w-[min(94vw,520px)] -translate-x-1/2 border border-[color:var(--line-strong)] bg-ink-raised/95 p-6 backdrop-blur-xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Pinned</p>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {[...apps, { id: "experience", label: "Experience", tile: <Tile text="XP" tone="paper" /> }].map((a) => (
              <button
                key={a.label}
                role="menuitem"
                type="button"
                onClick={() => (a.id === "experience" ? openDoc("experience") : run(a.id))}
                className="group flex flex-col items-center gap-2"
              >
                <span className="relative h-12 w-12 overflow-hidden border border-[color:var(--line-strong)] group-hover:border-acid">{a.tile}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted group-hover:text-paper">{a.label}</span>
              </button>
            ))}
            {[
              { label: "Resume", href: LINKS.resume, tile: <Tile text="CV" tone="paper" />, download: true },
              { label: "Email", href: `mailto:${LINKS.email}`, tile: <Tile text="@" tone="ink" /> },
              { label: "GitHub", href: LINKS.github, tile: <Tile text="GH" tone="ink" /> },
              { label: "LinkedIn", href: LINKS.linkedin, tile: <Tile text="in" tone="ink" /> },
            ].map((a) => (
              <a
                key={a.label}
                role="menuitem"
                href={a.href}
                download={a.download}
                target={a.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="group flex flex-col items-center gap-2"
              >
                <span className="relative h-12 w-12 overflow-hidden border border-[color:var(--line-strong)] group-hover:border-acid">{a.tile}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted group-hover:text-paper">{a.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[color:var(--line)] pt-4">
            <span>
              <span className="display block text-lg text-paper">Wasif Zaman</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Open to graduate and junior roles</span>
            </span>
            <span className="flex gap-2">
              <Link href="/shop" className="border border-acid px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-acid hover:bg-acid hover:text-black">
                Shop →
              </Link>
              <Link href="/studio" className="border border-[color:var(--line-strong)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper hover:border-acid hover:text-acid">
                Studio →
              </Link>
            </span>
          </div>
        </div>
      )}

      <nav aria-label="Taskbar" className="fixed inset-x-0 bottom-0 z-[150] flex h-12 items-center justify-between border-t border-[color:var(--line)] bg-ink-sunken/90 px-2 backdrop-blur-xl">
        <span className="hidden w-64 font-mono text-[10px] uppercase tracking-[0.14em] text-muted lg:block">Open to graduate and junior roles</span>
        <div className="flex items-center gap-1">
          <button
            data-start
            type="button"
            aria-expanded={start}
            aria-label="Start"
            onClick={() => setStart((s) => !s)}
            className={`flex h-10 w-10 items-center justify-center transition-colors hover:bg-[rgba(244,241,234,0.08)] ${start ? "bg-[rgba(244,241,234,0.08)]" : ""}`}
          >
            <span className="display flex h-7 w-7 items-center justify-center bg-acid text-[13px] text-black">WZ</span>
          </button>
          {apps.map((a) => {
            const isOpen = stack.includes(a.id);
            const isFront = stack[stack.length - 1] === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => run(a.id)}
                aria-label={a.label}
                aria-pressed={isOpen}
                className={`relative flex h-10 w-10 items-center justify-center transition-colors hover:bg-[rgba(244,241,234,0.08)] ${a.id === "projects" ? "hidden md:flex" : ""}`}
              >
                <span className="h-7 w-7 overflow-hidden">{a.tile}</span>
                {isOpen && <span className={`absolute bottom-0.5 h-[3px] ${isFront ? "w-4 bg-acid" : "w-1.5 bg-muted"}`} />}
              </button>
            );
          })}
          <a href={LINKS.resume} download aria-label="Resume" className="flex h-10 w-10 items-center justify-center hover:bg-[rgba(244,241,234,0.08)]">
            <span className="h-7 w-7"><Tile text="CV" tone="paper" /></span>
          </a>
          <a href={`mailto:${LINKS.email}`} aria-label="Email" className="flex h-10 w-10 items-center justify-center hover:bg-[rgba(244,241,234,0.08)]">
            <span className="h-7 w-7"><Tile text="@" tone="ink" /></span>
          </a>
        </div>
        <div className="flex w-auto items-center justify-end gap-4 pr-2 font-mono text-[11px] lg:w-64">
          <a href={LINKS.github} target="_blank" rel="noreferrer noopener" className="text-muted transition-colors hover:text-acid">GitHub</a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer noopener" className="hidden text-muted transition-colors hover:text-acid sm:block">LinkedIn</a>
          <Clock />
        </div>
      </nav>
    </div>
  );
}
