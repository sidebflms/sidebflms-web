import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "@/app/globals.css";
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
  icons: { icon: "/icon.svg" },
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
      <body className="min-h-dvh bg-ink-800 text-bone">
        <a
          href="#main"
          className="sr-only font-mono text-xs uppercase tracking-[0.08em] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-rust-500 focus:px-4 focus:py-3 focus:text-bone"
        >
          {dict.nav.skipToContent}
        </a>

        <SmoothScroll />
        <Cursor />

        <Header locale={locale} nav={dict.nav} />
        <Reglet />

        {children}

        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
