"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import { CATEGORIES, countByCategory, type Category } from "@/content/projects";

/**
 * Filtro de portfolio. El estado vive en la URL (`?cat=drone`), no en un
 * `useState` local: así el filtro es compartible, funciona con el botón
 * atrás/adelante del navegador y sobrevive a una recarga.
 *
 * `aria-pressed` en cada botón — son toggles, no enlaces de navegación.
 */
export function FilterBar({
  active,
  dict,
}: {
  active: Category | "all";
  dict: Dictionary;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = (category: Category | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("cat");
    } else {
      params.set("cat", category);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const options: Array<{ key: Category | "all"; label: string; count: number }> = [
    { key: "all", label: dict.portfolio.all, count: countByCategory("all") },
    ...CATEGORIES.map((category) => ({
      key: category,
      label: dict.portfolio.categories[category],
      count: countByCategory(category),
    })),
  ];

  return (
    <nav aria-label={dict.portfolio.filterLabel} className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option.key === active;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => setCategory(option.key)}
            className={cn(
              "border px-4 py-2 font-mono text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200",
              isActive
                ? "border-rust-500 bg-rust-500 text-bone"
                : "border-ink-600 text-smoke hover:border-rust-300 hover:text-rust-300"
            )}
          >
            {option.label} <span className="text-[10px] opacity-70">({option.count})</span>
          </button>
        );
      })}
    </nav>
  );
}
