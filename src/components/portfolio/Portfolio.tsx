import { useEffect, useRef, useMemo, useState, type ComponentProps, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  CirclePlay,
  ExternalLink,
  Menu,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { pricing, siteConfig } from "@/data/config";
import { categoryLabels, projects, type Project, type ProjectCategory } from "@/data/projects";
import showreelArt from "@/assets/project-motion.jpg";
import portraitArt from "@/assets/project-vfx.jpg";
import { inquirySchema, projectTypes, budgets, submitInquiry } from "@/data/inquiry";
import { resolveMedia } from "@/data/media";

const filters: Array<"all" | ProjectCategory> = [
  "all",
  "gaming",
  "youtube",
  "vfx",
  "music video",
  "creatives",
];
const platformLabels = {
  youtube: "YouTube",
  instagram: "Instagram",
  vimeo: "Vimeo",
  other: "Web",
} as const;

// YouTube answers a missing HD thumbnail with a small grey 120px placeholder, which
// does not always trigger onError, so the image's real width is checked as well.
function Thumb(props: ComponentProps<"img">) {
  const ref = useRef<HTMLImageElement>(null);
  const fallback = (el: HTMLImageElement) => {
    if (el.src.includes("maxresdefault") && el.complete && el.naturalWidth <= 120) {
      el.src = el.src.replace("maxresdefault", "hqdefault");
    }
  };
  // The image can finish loading before React attaches onLoad, so check once on mount too.
  useEffect(() => {
    if (ref.current) fallback(ref.current);
  }, [props.src]);
  return (
    <img
      {...props}
      ref={ref}
      onLoad={(e) => fallback(e.currentTarget)}
      onError={(e) => fallback(e.currentTarget)}
    />
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid min-h-48 place-items-center border border-dashed border-border p-8 text-center">
      <div>
        <p className="font-mono text-xs uppercase text-primary">Coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">{label} work is on its way.</p>
      </div>
    </div>
  );
}
const nav = ["work", "services", "pricing", "about", "contact"];

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase text-muted-foreground">
      <span className="text-primary">{index}</span>
      <span className="h-px w-8 bg-border" />
      {children}
    </div>
  );
}

function OriginalLink({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.sourceUrl)
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 text-xs uppercase text-muted-foreground",
          className,
        )}
      >
        Original source pending
      </span>
    );
  return (
    <a
      href={project.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "story-link inline-flex items-center gap-2 text-xs font-semibold uppercase text-foreground",
        className,
      )}
    >
      View original <ExternalLink className="size-3" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-border/70 bg-background/80 py-3 backdrop-blur-xl"
          : "border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-lg font-black uppercase">
          {siteConfig.name}
          <span className="text-primary">.</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-xs font-semibold uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>
        <Button asChild className="hidden rounded-none uppercase lg:inline-flex">
          <a href="#contact">
            Let's work <ArrowRight />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background px-5 py-6 lg:hidden"
          >
            {nav.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-4 text-2xl font-bold uppercase"
              >
                {item}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const heroProjects = projects.filter((p) => p.sourceType === "youtube").slice(0, 4);
  return (
    <section
      id="top"
      className="relative flex min-h-[94svh] items-end overflow-hidden border-b border-border px-5 pb-12 pt-28 md:px-8 md:pb-16"
    >
      <div className="absolute inset-0 grid grid-cols-2 opacity-35 md:grid-cols-4">
        {heroProjects.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "relative overflow-hidden border-r border-background",
              i % 2 ? "translate-y-12" : "-translate-y-4",
            )}
          >
            <Thumb src={p.thumbnail} alt="" className="h-full w-full object-cover grayscale" />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-hero-vignette" />
      <div className="relative z-10 mx-auto w-full max-w-[1500px]">
        <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase">
          <span className="size-2 animate-pulse rounded-full bg-primary" /> Available for projects
        </div>
        <p className="mb-4 font-mono text-xs uppercase text-muted-foreground">
          Video editor <span className="text-primary">&</span> motion designer
        </p>
        <h1 className="max-w-6xl font-display text-[3rem] sm:text-[4.5rem] lg:text-[6rem] xl:text-[7rem] font-black uppercase leading-[0.84]">
          I create videos
          <br />
          that demand <span className="text-outline">attention.</span>
        </h1>
        <div className="mt-9 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="mb-6 max-w-xl text-sm text-muted-foreground md:text-base">
              YouTube · Gaming · VFX · Motion Graphics · Short Form
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none uppercase">
                <a href="#showreel">
                  <Play className="fill-current" /> Watch showreel
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none uppercase">
                <a href="#contact">Hire me</a>
              </Button>
            </div>
          </div>
          <a
            href="#showreel"
            aria-label="Scroll to selected work"
            className="flex items-center gap-3 text-xs uppercase text-muted-foreground"
          >
            <span className="h-px w-12 bg-border" /> Scroll{" "}
            <ArrowDown className="size-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function VideoFrame({ project }: { project?: Project }) {
  const source = project
    ? project.videoUrl || (project.sourceType === "instagram" ? project.sourceUrl : "")
    : siteConfig.showreelUrl;
  const media = resolveMedia(source);
  const poster = project?.thumbnail || showreelArt;
  if (media.kind === "youtube" || media.kind === "vimeo")
    return (
      <iframe
        className="aspect-video w-full"
        src={media.url}
        title={project?.title || "Showreel"}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  if (media.kind === "video")
    return (
      <video
        className="aspect-video w-full object-cover"
        src={media.url}
        poster={poster}
        controls
        preload="metadata"
      />
    );
  if (media.kind === "instagram")
    return (
      <div className="relative aspect-video overflow-hidden">
        <img
          src={poster}
          alt={project?.title || "Instagram project"}
          loading="lazy"
          width={1536}
          height={1024}
          className="h-full w-full object-contain"
        />
        <Button asChild className="absolute bottom-5 left-5 rounded-none uppercase">
          <a href={media.url} target="_blank" rel="noreferrer">
            View on Instagram <ExternalLink />
          </a>
        </Button>
      </div>
    );
  return (
    <div className="group relative aspect-video overflow-hidden bg-card">
      <img
        src={poster}
        alt={project?.title || "Showreel preview placeholder"}
        width={1536}
        height={1024}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
      />
      <div className="absolute inset-0 bg-media-overlay" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-20 place-items-center rounded-full border border-foreground/40 bg-background/30 backdrop-blur">
          <Play className="ml-1 size-7 fill-current" />
        </span>
      </div>
      <span className="absolute bottom-5 left-5 font-mono text-xs uppercase text-muted-foreground">
        Showreel coming soon
      </span>
    </div>
  );
}

function Showreel() {
  return (
    <section id="showreel" className="section-space border-b border-border">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionLabel index="01">Selected work</SectionLabel>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="section-title">
            SHOWREEL<span className="text-primary">’26</span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            A focused selection of editing, visual effects and motion work.
          </p>
        </div>
        <VideoFrame />
        <div className="mt-5 flex items-center gap-3 text-sm font-semibold uppercase">
          <CirclePlay className="text-primary" /> Play showreel
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const large = index % 5 === 0 || index % 5 === 3;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group relative overflow-hidden border border-border bg-card",
        large && "md:col-span-2",
      )}
    >
      <Button
        variant="project"
        onClick={onOpen}
        className={cn(
          "relative block h-auto w-full overflow-hidden p-0 text-left",
          project.format === "vertical" ? "aspect-[4/3]" : large ? "aspect-[16/8]" : "aspect-[4/3]",
        )}
        aria-label={`View ${project.title}`}
      >
        <Thumb
          src={project.thumbnail}
          alt={`${project.title} preview`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-project-overlay opacity-45 transition-opacity group-hover:opacity-90" />
        <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Play className="ml-1 fill-current" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-5 transition-transform group-hover:translate-y-0">
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase text-primary">
              {project.client ? `${project.client} · ` : ""}
              {categoryLabels[project.category]}
            </span>
            <h3 className="text-2xl font-bold uppercase md:text-3xl">{project.title}</h3>
          </div>
          <span className="hidden items-center gap-2 text-xs uppercase md:flex">
            View project <ArrowRight className="size-3" />
          </span>
        </div>
      </Button>
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="text-xs text-muted-foreground">
          {project.year ?? platformLabels[project.sourceType]}
        </span>
        <OriginalLink project={project} />
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(project)} onOpenChange={(open) => !open && onClose()}>
      {project && (
        <DialogContent className="max-h-[96svh] max-w-[1400px] overflow-y-auto rounded-none border-border bg-background p-0 text-foreground">
          <div className="p-5 pr-14 md:p-9 md:pr-16">
            <p className="font-mono text-xs uppercase text-primary">
              {project.client ? `${project.client} / ` : ""}
              {categoryLabels[project.category]}
              {project.year ? ` / ${project.year}` : ""}
            </p>
            <DialogTitle className="mt-2 font-display text-4xl font-black uppercase md:text-7xl">
              {project.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Project details and preview for {project.title}
            </DialogDescription>
          </div>
          <VideoFrame project={project} />
          <div className="grid gap-8 p-5 md:grid-cols-[1.3fr_.7fr] md:p-9">
            <div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild disabled={!project.videoUrl} className="rounded-none uppercase">
                  <a href={project.videoUrl || undefined} target="_blank" rel="noreferrer">
                    <Play /> Watch video
                  </a>
                </Button>
                {project.sourceUrl ? (
                  <Button asChild variant="outline" className="rounded-none uppercase">
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                      View original <ExternalLink />
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="rounded-none uppercase">
                    Original source pending
                  </Button>
                )}
              </div>
            </div>
            <div>
              <p className="mb-4 font-mono text-xs uppercase text-muted-foreground">Services</p>
              <ul className="space-y-3">
                {project.services.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 border-b border-border pb-3 text-sm uppercase"
                  >
                    <span className="size-1.5 bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const shown = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  return (
    <section id="work" className="section-space border-b border-border">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionLabel index="02">Project library</SectionLabel>
        <div className="mb-9 flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="section-title">THE WORK</h2>
          <div className="flex max-w-full gap-1 overflow-x-auto pb-2">
            {filters.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                className="rounded-none uppercase"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "all" : categoryLabels[f]}
              </Button>
            ))}
          </div>
        </div>
        {shown.length === 0 && (
          <EmptyState label={filter === "all" ? "Project" : categoryLabels[filter]} />
        )}
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}

const categorySections = [
  {
    category: "gaming" as const,
    subtitle: "Fast cuts. Sync edits. Cinematic gameplay.",
    tags: ["Montages", "Highlights", "Cinematic Gameplay", "Character Edits", "Trailers"],
  },
  {
    category: "youtube" as const,
    subtitle: "From talking heads to fast-paced storytelling.",
    tags: ["Talking Head", "Commentary", "Educational", "Documentary", "Podcast", "Vlog"],
  },
  {
    category: "vfx" as const,
    subtitle: "Making the impossible look real.",
    tags: ["Tracking", "Compositing", "Roto", "Screen Replacement", "Color"],
  },
  {
    category: "music video" as const,
    subtitle: "Visuals that move with the music.",
    tags: ["Music Videos", "Cinematic Edits", "Lyric Videos", "Promos"],
  },
  {
    category: "creatives" as const,
    subtitle: "Experimental and personal creative work.",
    tags: ["Concept Edits", "Visual Experiments", "Social Content"],
  },
];

function Disciplines() {
  return (
    <section className="border-b border-border">
      {categorySections.map((section, i) => {
        const title = categoryLabels[section.category];
        const items = projects.filter((p) => p.category === section.category).slice(0, 2);
        return (
          <div
            key={section.category}
            className={cn(
              "section-space border-b border-border last:border-0",
              i % 2 ? "bg-card/50" : "",
            )}
          >
            <div className="mx-auto grid max-w-[1500px] gap-10 px-5 md:px-8 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <p className="mb-3 font-mono text-xs text-primary">0{i + 3}</p>
                <h2 className="section-title">{title}</h2>
                <p className="mt-5 text-lg text-muted-foreground">{section.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {section.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-border px-3 py-2 font-mono text-[10px] uppercase text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {items.length === 0 ? (
                <EmptyState label={title} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((p) => (
                    <article
                      key={p.id}
                      className="group overflow-hidden border border-border bg-card"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <Thumb
                          src={p.thumbnail}
                          alt={`${p.title} preview`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold uppercase">
                          {p.client ? `${p.client} · ` : ""}
                          {p.title}
                        </h3>
                        <div className="mt-3">
                          <OriginalLink project={p} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

const services = [
  ["Video Editing", ["YouTube", "Short Form", "Vlogs", "Documentary", "Talking Head", "Podcast"]],
  ["Gaming", ["Montages", "Highlights", "Cinematic Gameplay", "Trailers"]],
  ["VFX", ["Compositing", "Tracking", "Rotoscoping", "Screen Replacement", "Visual Effects"]],
  [
    "Motion Graphics",
    ["Logo Animation", "Intros", "Kinetic Typography", "Titles", "Lower Thirds", "Social Graphics"],
  ],
  ["Creative Editing", ["Music Videos", "Cinematic Edits", "Promotional Videos", "Social Content"]],
] as const;

function Services() {
  return (
    <section id="services" className="section-space border-b border-border">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionLabel index="08">Capabilities</SectionLabel>
        <h2 className="section-title mb-12">WHAT I DO</h2>
        <div className="grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-5">
          {services.map(([name, items], i) => (
            <article
              key={name}
              className="group min-h-80 border-b border-r border-border bg-background p-6 transition-colors hover:bg-card"
            >
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-16 text-2xl font-black uppercase">{name}</h3>
              <ul className="mt-7 space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="section-space border-b border-border bg-card/50">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionLabel index="09">Investment</SectionLabel>
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="section-title">START HERE</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every project is different. These are transparent starting points, not fixed quotes.
          </p>
        </div>
        <div className="grid gap-px bg-border lg:grid-cols-3">
          {pricing.packages.map((p) => (
            <article
              key={p.name}
              className={cn(
                "relative bg-background p-7 md:p-9",
                "featured" in p && p.featured && "ring-1 ring-inset ring-primary",
              )}
            >
              {"featured" in p && p.featured && (
                <span className="absolute right-0 top-0 bg-primary px-3 py-2 font-mono text-[10px] font-bold uppercase text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-black uppercase">{p.name}</h3>
              <p className="mt-10 font-mono text-[10px] uppercase text-muted-foreground">
                Starting from
              </p>
              <p className="mt-2 text-5xl font-black">{p.price}</p>
              <ul className="mt-9 space-y-4">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {pricing.specialties.map(([name, price]) => (
            <div key={name} className="bg-background p-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{name}</p>
              <p className="mt-3 text-xl font-bold">{price}</p>
              <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
                Starting from
              </p>
            </div>
          ))}
        </div>
        <div className="mt-20">
          <h3 className="mb-8 text-4xl font-black uppercase">Need more?</h3>
          <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {pricing.addons.map(([name, price]) => (
              <div
                key={name}
                className="flex justify-between border-b border-r border-border p-5 text-sm"
              >
                <span>{name}</span>
                <strong>{price}</strong>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase text-muted-foreground">
            All add-ons are starting prices
          </p>
        </div>
      </div>
    </section>
  );
}

const process = [
  ["Send", "Send footage, references and requirements."],
  ["Plan", "We understand the style, audience and goals."],
  ["Edit", "Editing, pacing, sound, graphics and VFX."],
  ["Review", "You review the first version."],
  ["Deliver", "Final video is delivered."],
];
function Process() {
  const reduce = useReducedMotion();
  return (
    <section className="section-space border-b border-border">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <SectionLabel index="10">Process</SectionLabel>
        <h2 className="section-title mb-12">
          FROM IDEA TO
          <br />
          FINAL CUT
        </h2>
        <div className="relative grid gap-8 md:grid-cols-5 md:gap-0">
          <motion.div
            className="absolute left-0 top-5 hidden h-px bg-primary md:block"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 1.3 }}
          />
          {process.map(([title, text], i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : i * 0.12 }}
              className="relative md:pr-8"
            >
              <span className="relative z-10 inline-grid size-10 place-items-center border border-primary bg-background font-mono text-xs text-primary">
                0{i + 1}
              </span>
              <h3 className="mt-6 text-xl font-black uppercase">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  const items = [
    ["Story", "I focus on structure, pacing and storytelling."],
    ["Attention", "Cuts, sound, graphics and effects are used intentionally."],
    ["Style", "Every project gets a visual identity rather than a generic edit."],
    ["Versatility", "YouTube · Gaming · VFX · Motion · Short Form"],
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-[1500px] md:grid-cols-2">
        {items.map(([title, text], i) => (
          <article
            key={title}
            className={cn(
              "min-h-72 border-border p-6 md:p-10",
              i < 2 && "border-b",
              i % 2 === 0 && "md:border-r",
            )}
          >
            <span className="font-mono text-xs text-primary">0{i + 1}</span>
            <h2 className="mt-12 text-5xl font-black uppercase md:text-7xl">{title}</h2>
            <p className="mt-5 max-w-md text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <section className="overflow-hidden border-b border-border py-7">
        <div className="software-track flex w-max items-center gap-16 whitespace-nowrap pr-16">
          {[...siteConfig.software, ...siteConfig.software].map((s, i) => (
            <span
              key={`${s}-${i}`}
              className="font-display text-2xl font-black uppercase text-muted-foreground"
            >
              {s}
              <span className="ml-16 text-primary">✦</span>
            </span>
          ))}
        </div>
      </section>
      <section id="about" className="section-space border-b border-border">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[440px] overflow-hidden border border-border bg-card">
            <img
              src={portraitArt}
              alt="Replaceable portrait placeholder"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-full w-full object-cover grayscale opacity-45"
            />
            <div className="absolute inset-0 grid place-items-center">
              <span className="border border-border bg-background/80 px-4 py-3 font-mono text-xs uppercase text-muted-foreground backdrop-blur">
                Portrait placeholder
              </span>
            </div>
          </div>
          <div>
            <SectionLabel index="11">About</SectionLabel>
            <h2 className="section-title">WHO AM I?</h2>
            <p className="mt-10 max-w-2xl text-2xl leading-snug text-muted-foreground md:text-4xl">
              I'm <span className="text-foreground">{siteConfig.name}</span>, a video editor and
              visual creator specializing in editing, VFX and motion graphics.
            </p>
            <p className="mt-7 max-w-xl text-muted-foreground">
              I enjoy turning ordinary footage and ideas into videos with energy, personality and
              style.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              <span className="border border-border px-4 py-3 text-sm">
                Based in {siteConfig.location}
              </span>
              <span className="border border-border px-4 py-3 text-sm">
                {siteConfig.availability}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!result.success) {
      const next: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") next[key] = issue.message;
      });
      setErrors(next);
      setNotice("Please complete the highlighted fields.");
      return;
    }
    setErrors({});
    if (submitInquiry) {
      try {
        await submitInquiry(result.data);
        setNotice("Your inquiry has been sent.");
      } catch {
        setNotice("Your inquiry could not be sent. Please try again.");
      }
    } else setNotice("Sending is not connected yet. Your inquiry has not been submitted.");
  };
  const field =
    "w-full rounded-none border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  return (
    <section id="contact" className="section-space bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs font-bold uppercase">Project inquiry</p>
          <h2 className="mt-8 font-display text-[3.5rem] sm:text-[5rem] xl:text-[6rem] font-black uppercase leading-[.84]">
            GOT A<br />
            PROJECT?
          </h2>
          <p className="mt-8 max-w-sm text-lg opacity-70">Tell me what you're working on.</p>
        </div>
        <form
          onSubmit={submit}
          noValidate
          className="grid gap-5 bg-background p-5 text-foreground md:grid-cols-2 md:p-9"
        >
          {(
            [
              ["name", "Name", "text", "Your name"],
              ["email", "Email", "email", "you@email.com"],
              ["deadline", "Deadline", "text", "Ideal delivery date"],
              ["reference", "Reference link", "url", "https://"],
            ] as const
          ).map(([name, label, type, placeholder]) => (
            <label key={name} className="block text-xs font-semibold uppercase">
              {label}
              <input
                name={name}
                type={type}
                maxLength={name === "reference" ? 500 : 120}
                placeholder={placeholder}
                className={cn(field, "mt-2", errors[name] && "border-destructive")}
              />
              {errors[name] && <span className="mt-1 block text-destructive">{errors[name]}</span>}
            </label>
          ))}
          <label className="block text-xs font-semibold uppercase">
            Project type
            <select
              name="projectType"
              defaultValue=""
              className={cn(field, "mt-2", errors["projectType"] && "border-destructive")}
            >
              <option value="" disabled>
                Select type
              </option>
              {projectTypes.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase">
            Budget
            <select
              name="budget"
              defaultValue=""
              className={cn(field, "mt-2", errors["budget"] && "border-destructive")}
            >
              <option value="" disabled>
                Select budget
              </option>
              {budgets.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase md:col-span-2">
            Project description
            <textarea
              name="description"
              maxLength={2000}
              rows={6}
              placeholder="Share the idea, scope and footage details."
              className={cn(field, "mt-2 resize-y", errors["description"] && "border-destructive")}
            />
            {errors["description"] && (
              <span className="mt-1 block text-destructive">{errors["description"]}</span>
            )}
          </label>
          <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <p aria-live="polite" className="max-w-md text-xs text-muted-foreground">
              {notice || "Inquiry delivery is not connected yet."}
            </p>
            <Button type="submit" size="lg" className="rounded-none uppercase">
              Start a project <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const links = Object.entries(siteConfig.socials).filter(([, url]) => Boolean(url));
  return (
    <footer className="border-t border-border bg-background px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="font-display text-3xl font-black uppercase">
            {siteConfig.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Video Editor & Motion Designer</p>
        </div>
        <div className="flex flex-wrap gap-5">
          {links.length ? (
            links.map(([name, url]) => (
              <a
                key={name}
                href={name === "email" ? `mailto:${url}` : url}
                target={name === "email" ? undefined : "_blank"}
                rel="noreferrer"
                className="story-link text-xs font-semibold uppercase"
              >
                {name}
              </a>
            ))
          ) : (
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              Social links coming soon
            </span>
          )}
        </div>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">
          © 2026 All rights reserved
        </p>
      </div>
    </footer>
  );
}

export function Portfolio() {
  return (
    <main>
      <Header />
      <Hero />
      <Showreel />
      <Work />
      <Disciplines />
      <Services />
      <Pricing />
      <Process />
      <Philosophy />
      <About />
      <Contact />
      <Footer />
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-30 grid size-10 place-items-center border border-border bg-background text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronRight className="-rotate-90" />
      </a>
    </main>
  );
}
