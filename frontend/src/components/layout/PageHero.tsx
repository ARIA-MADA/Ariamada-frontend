import { Eyebrow } from "@/components/ui";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden border-b border-white/15 bg-[#151312] pb-14 pt-28 text-white md:pb-16 md:pt-32">
      <img
        src="/images/Antsirabe.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/55 to-black/25"
        aria-hidden="true"
      />
      <div className="container-site">
        <div className="animate-rise max-w-3xl">
          <Eyebrow className="text-white/75!">{eyebrow}</Eyebrow>
          <h1 className="title-page text-white!">{title}</h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
