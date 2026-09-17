"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

/**
 * EL FORMULARIO POR PASOS, compartido por «Contacto» y «Trabaja con nosotros».
 *
 * Un panel de cristal con un carril a la izquierda que trocea el formulario
 * en pasos con los rótulos que le pasa cada página. El carril escucha el foco
 * y lo que se escribe (eventos que suben del formulario) para marcar en qué
 * paso estás y cuáles ya tienen algo; y al pulsar un paso, lleva a su campo.
 *
 * El formulario llega como `children` y no se toca: aquí no se sabe nada de
 * su server action, su validación ni su honeypot. Vivía dentro de
 * `contacto-tarjetas.tsx`; se sacó aquí para que las dos páginas no llevaran
 * dos copias del mismo carril que acabaran divergiendo.
 */

export type PasoFormulario = {
  /** Rótulo del paso en el carril. */
  nombre: string;
  /** Los `name` de los campos que agrupa, en orden: el primero es el que se enfoca. */
  campos: string[];
};

export function FormularioPorPasos({
  id,
  reglet,
  titulo,
  pasos,
  dict,
  separado = false,
  children,
}: {
  /** Sin tarjetas encima: algo de aire, pero menos que entre secciones
   *  (cliente, 2026-09-17: con los 80 px de `.seccion` quedaba despegado de
   *  los botones de contacto). */
  separado?: boolean;
  id: string;
  reglet: string;
  titulo: string;
  pasos: PasoFormulario[];
  dict: Dictionary;
  children: ReactNode;
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const marcaRef = useRef<HTMLSpanElement>(null);
  const pasosRef = useRef<HTMLOListElement>(null);
  const [activo, setActivo] = useState(0);
  const [hechos, setHechos] = useState<boolean[]>([]);
  const [enviado, setEnviado] = useState(false);

  // Los pasos llegan como array nuevo en cada render; el efecto depende de
  // esta clave de texto para no reengancharse cada vez que se pinta.
  const clave = pasos.map((p) => p.campos.join(",")).join("|");

  // ── EL CARRIL ESCUCHA AL FORMULARIO ───────────────────────────────────────
  // Sólo lee: `focusin`, `input` y `change` suben burbujeando desde los campos
  // hasta este contenedor. La lógica del formulario (server action,
  // validación, honeypot) no se entera de que el carril existe.
  useEffect(() => {
    const caja = formRef.current;
    if (!caja) return;
    const grupos = clave.split("|").map((g) => g.split(","));
    const pasoDe = (name: string) => grupos.findIndex((campos) => campos.includes(name));

    const recuenta = () => {
      const form = caja.querySelector("form");
      if (!form) return;
      setHechos(
        grupos.map((campos) =>
          campos.some((name) =>
            Array.from(form.querySelectorAll<HTMLInputElement>(`[name="${name}"]`)).some((el) =>
              // Casillas y botones de radio llevan `value` aunque nadie los
              // marque: lo que cuenta en ellos es si están marcados.
              el.type === "checkbox" || el.type === "radio" ? el.checked : el.value.trim() !== ""
            )
          )
        )
      );
    };
    const onFoco = (e: FocusEvent) => {
      const name = (e.target as HTMLInputElement | null)?.name;
      const i = name ? pasoDe(name) : -1;
      if (i >= 0) setActivo(i);
    };

    // Tras enviar, el formulario se sustituye por el acuse de recibo: el
    // carril ya no tiene nada que señalar y se retira.
    const obs = new MutationObserver(() => setEnviado(!caja.querySelector("form")));
    obs.observe(caja, { childList: true, subtree: true });

    caja.addEventListener("focusin", onFoco);
    caja.addEventListener("input", recuenta);
    caja.addEventListener("change", recuenta);
    return () => {
      obs.disconnect();
      caja.removeEventListener("focusin", onFoco);
      caja.removeEventListener("input", recuenta);
      caja.removeEventListener("change", recuenta);
    };
  }, [clave]);

  // La marca naranja del carril se desliza hasta el paso activo (sólo desde
  // `lg`, que es cuando el carril es vertical).
  // Se recoloca también al cambiar el ancho: los rótulos largos pasan a dos
  // líneas y los pasos cambian de alto.
  useEffect(() => {
    const coloca = (animar: boolean) => {
      const marca = marcaRef.current;
      const item = pasosRef.current?.children[activo] as HTMLElement | undefined;
      if (!marca || !item) return;
      const props = { y: item.offsetTop, height: item.offsetHeight };
      if (!animar || prefersReducedMotion()) gsap.set(marca, props);
      else gsap.to(marca, { ...props, duration: 0.55, ease: "power3.out", overwrite: true });
    };
    coloca(true);
    const onResize = () => coloca(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activo, enviado]);

  // El panel sube al entrar, en los dos sentidos. Se anima el PROPIO cristal,
  // nunca un contenedor suyo (ver «la trampa del desenfoque» en globals.css).
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;
    const { ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(panel, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: panel,
        start: "top 88%",
        onEnter: () => gsap.to(panel, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", overwrite: true }),
        onLeaveBack: () => gsap.to(panel, { opacity: 0, y: 40, duration: 0.35, ease: "power2.in", overwrite: true }),
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  /** Del carril al campo: se enfoca sin salto nativo y se lleva con Lenis. */
  const irAlPaso = (i: number) => {
    const campo = formRef.current?.querySelector<HTMLElement>(`[name="${pasos[i].campos[0]}"]`);
    if (!campo) return;
    campo.focus({ preventScroll: true });
    if (window.__lenis) window.__lenis.scrollTo(campo, { offset: -window.innerHeight * 0.35, duration: 0.9 });
    else campo.scrollIntoView({ block: "center" });
    setActivo(i);
  };

  return (
    <section
      id={id}
      data-reglet={reglet}
      aria-labelledby={`${id}-titulo`}
      className={cn("shell scroll-mt-28", separado ? "mt-8 lg:mt-10" : "mt-3")}
    >
      <div
        ref={panelRef}
        className="glass grid gap-8 overflow-clip rounded-[var(--radius-frame)] p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10"
      >
        {/* `min-w-0`: sin él, en móvil la fila de pasos (que hace scroll
            horizontal por dentro) ensanchaba la columna hasta su ancho
            natural, más de 1000 px, y el panel recortaba el formulario. */}
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            {/* Columna 4/12 dentro del relleno de un panel del 70 % de la
                ventana: a 1024 px da ~200 px, y «PRESUPUESTO» mide 10.14× el
                cuerpo. De ahí el 1,4vw. */}
            <h2
              id={`${id}-titulo`}
              className="font-display text-display-m text-bone lg:text-[clamp(1rem,1.4vw,2.25rem)]"
            >
              {titulo}
            </h2>

            {!enviado && (
              // El carril es una ayuda visual para ratón y vista; con teclado
              // se recorre el formulario con Tab como siempre, así que sus
              // botones son un atajo más, no el único camino.
              <div className="relative mt-8">
                <span
                  ref={marcaRef}
                  aria-hidden="true"
                  className="absolute top-0 left-0 hidden w-0.5 rounded-full bg-rust-500 lg:block"
                />
                <ol
                  ref={pasosRef}
                  className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-white/10 lg:px-0 lg:pb-0"
                >
                  {pasos.map((paso, i) => {
                    const sel = i === activo;
                    const hecho = hechos[i];
                    return (
                      <li key={paso.nombre} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => irAlPaso(i)}
                          aria-current={sel ? "step" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-full py-2 pr-4 pl-2 text-left text-xs whitespace-nowrap transition-colors duration-300 lg:w-full lg:rounded-none lg:py-3 lg:pl-5 lg:text-sm lg:whitespace-normal",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-300",
                            sel ? "bg-white/10 text-bone lg:bg-transparent" : "text-bone/55 hover:text-bone"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums transition-colors duration-300",
                              hecho ? "border-rust-500 bg-rust-500 text-ink-900" : sel ? "border-rust-300 text-rust-300" : "border-bone/20"
                            )}
                          >
                            {hecho ? (
                              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 6.2 5 8.5l4.5-5" />
                              </svg>
                            ) : (
                              pad(i + 1)
                            )}
                          </span>
                          {paso.nombre}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            <div className="mt-10 hidden border-t border-white/10 pt-6 lg:block">
              <p className="label">{dict.contact.directLabel}</p>
              <a href={`mailto:${dict.contact.email}`} className="mt-2 block break-all text-bone transition-colors hover:text-rust-300">
                {dict.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div ref={formRef} className="min-w-0 lg:col-span-8">
          {children}
        </div>
      </div>
    </section>
  );
}
