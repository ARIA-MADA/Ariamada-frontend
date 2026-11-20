import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
export { ProjectImage } from "./ProjectImage";

/* ============================================================
   Eyebrow mono : « (a) — Pourquoi ARIA »
   ============================================================ */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow mb-4 ${className}`}>{children}</p>;
}

/* ============================================================
   En-tête de section : eyebrow + titre + intro
   ============================================================ */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const alignCls = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`mb-12 max-w-3xl ${alignCls} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="title-section">{title}</h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : ""}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   Révélation au scroll ( IntersectionObserver — pas de GSAP )
   ============================================================ */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   Compteur animé (style Optiline : démarre à 0 au scroll)
   ============================================================ */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setValue(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/* ============================================================
   Marquee (logos / partenaires / pays)
   ============================================================ */
export function Marquee({
  children,
  speed = "normal",
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: "normal" | "medium" | "slow";
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {/* masques latéraux */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24"
        style={{ background: "linear-gradient(90deg, var(--color-background), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24"
        style={{ background: "linear-gradient(270deg, var(--color-background), transparent)" }}
        aria-hidden
      />
      <div
        className={`flex w-max items-center ${
          speed === "slow"
            ? "animate-marquee-slow"
            : speed === "medium"
              ? "animate-marquee-medium"
              : "animate-marquee"
        } ${reverse ? "[animation-direction:reverse]" : ""} group-hover:[animation-play-state:paused]`}
      >
        <div className="flex min-w-[100vw] shrink-0 items-center justify-start gap-3 pr-3 sm:gap-4 sm:pr-4">
          {children}
        </div>
        <div
          aria-hidden="true"
          className="flex min-w-[100vw] shrink-0 items-center justify-start gap-3 pr-3 sm:gap-4 sm:pr-4"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Carte de section (filet coloré en haut, hover lift)
   ============================================================ */
export function Card({
  children,
  tone = "orange",
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: "orange" | "blue" | "yellow";
  className?: string;
  as?: ElementType;
}) {
  const bar =
    tone === "blue" ? "bg-mint" : tone === "yellow" ? "bg-coral" : "bg-blue";
  return (
    <Tag className={`card ${className}`}>
      <span className={`card-topbar ${bar}`} aria-hidden />
      {children}
    </Tag>
  );
}

/* ============================================================
   Icône dans un carré (réf. Optiline / Only Cloz)
   ============================================================ */
export function IconBox({
  children,
  tone = "orange",
  className = "",
}: {
  children: ReactNode;
  tone?: "orange" | "blue" | "yellow";
  className?: string;
}) {
  const tones = {
    orange: "border-blue/25 bg-blue/10 text-blue",
    blue: "border-mint/25 bg-mint/10 text-mint",
    yellow: "border-coral/25 bg-coral/10 text-coral",
  };
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-lg border ${tones[tone]} ${className}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

/* ============================================================
   Section wrapper avec wash alterné
   ============================================================ */
export function Section({
  children,
  wash = "none",
  className = "",
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  wash?: "none" | "blue" | "mint" | "warm";
  className?: string;
  id?: string;
  as?: ElementType;
}) {
  const washCls =
    wash === "blue"
      ? "section-wash-blue"
      : wash === "mint"
        ? "section-wash-mint"
        : wash === "warm"
          ? "section-wash-warm"
          : "";
  return (
    <Tag id={id} className={`section-pad ${washCls} ${className}`}>
      <div className="container-site">{children}</div>
    </Tag>
  );
}
