import { Reveal } from "@/components/motion/reveal";

type Entry = { heading: string; text: string };

/** Layout compartido por Aviso legal y Privacidad: mismo tratamiento tipográfico. */
export function LegalPage({ title, entries }: { title: readonly string[]; entries: readonly Entry[] }) {
  return (
    <main id="main" className="pagina">
      <div className="shell max-w-3xl">
        <Reveal>
          <h1 className="font-display text-display-l text-bone">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>

        <div className="mt-16 space-y-12">
          {entries.map((entry) => (
            <Reveal key={entry.heading}>
              <h2 className="label text-rust-300">{entry.heading}</h2>
              <p className="mt-3 text-bone">{entry.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
