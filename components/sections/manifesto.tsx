import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

export function Manifesto({ dict }: { dict: Dictionary }) {
  return (
    <section data-reglet={dict.manifesto.label} className="grain relative bg-ink-900 py-28 lg:py-40">
      <div className="shell relative z-1 max-w-3xl">
        <Reveal>
          <p className="label">{dict.manifesto.label}</p>
        </Reveal>

        <Reveal as="h2" className="font-display text-display-l mt-6 text-bone">
          {dict.manifesto.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal stagger className="mt-10 space-y-4">
          {dict.manifesto.lines.map((line) => (
            <p key={line} className="text-lead measure text-smoke">
              {line}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
