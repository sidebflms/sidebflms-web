import type { Metadata } from "next";

import { BASE_PATH } from "@/lib/base";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { FondoRelieve } from "@/components/glass/fondos/fondo-relieve";
import { GlassSpotlight } from "@/components/glass/spotlight";
import { Analitica } from "@/components/layout/analitica";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Reglet } from "@/components/layout/reglet";
import { Cursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getDictionary } from "@/lib/dictionaries";
import { fontVariables } from "@/lib/fonts";
import { LOCALES, SITE_URL, isLocale } from "@/lib/routes";

/**
 * Root layout. Vive dentro de `[locale]` (y no en `app/`) para que el atributo
 * `lang` del `<html>` sea el real de cada idioma y no uno fijo.
 */

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Con ruta base delante: Next no se la pone a un `href` escrito a mano (lib/base.ts).
  icons: { icon: `${BASE_PATH}/icon.svg` },
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={fontVariables}>
      {/* SIN fondo en el body (versión glass): lo pone el <html> en
          globals.css. Con fondo aquí, el fondo de curvas de nivel —que va en z-index
          negativo— quedaría pintado por debajo y no se vería. */}
      <body className="min-h-dvh text-bone">
        <a
          href="#main"
          className="sr-only text-xs uppercase tracking-[0.08em] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-rust-500 focus:px-4 focus:py-3 focus:text-bone"
        >
          {dict.nav.skipToContent}
        </a>

        <FondoRelieve />
        <SmoothScroll />
        <Cursor />
        <GlassSpotlight />

        <Header locale={locale} nav={dict.nav} />
        <Reglet />

        {children}

        <Footer locale={locale} dict={dict} />

        <Analitica />
      </body>
    </html>
  );
}
