import type { Resource } from "@/lib/types";
import { ResourceBlock } from "./ResourceCards";

export interface CategoryConfig {
  key: string;
  heading: string;
  blurb?: string;
}

export function SectionHeader({ title, lede }: { title: string; lede: string }) {
  return (
    <div className="border-b border-ink-100 pb-6">
      <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-ink-600">{lede}</p>
    </div>
  );
}

export function SectionView({
  resources,
  categories,
}: {
  resources: Resource[];
  categories: CategoryConfig[];
}) {
  const known = new Set(categories.map((c) => c.key));
  const extras = resources.filter((r) => !known.has(r.category));
  const groups: Array<{ config: CategoryConfig; items: Resource[] }> = categories
    .map((config) => ({ config, items: resources.filter((r) => r.category === config.key) }))
    .filter((g) => g.items.length > 0);
  if (extras.length > 0) {
    groups.push({ config: { key: "_extras", heading: "More resources" }, items: extras });
  }

  if (groups.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
        Nothing here yet — your partner coach will add materials soon.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-12">
      {groups.map(({ config, items }) => {
        const videos = items.filter((r) => r.type === "youtube");
        const others = items.filter((r) => r.type !== "youtube");
        return (
          <section key={config.key}>
            <h2 className="font-display text-2xl font-bold text-ink-900">{config.heading}</h2>
            {config.blurb && <p className="mt-1 max-w-3xl text-sm text-ink-600">{config.blurb}</p>}
            {others.length > 0 && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {others.map((r) => (
                  <ResourceBlock key={r.id} resource={r} />
                ))}
              </div>
            )}
            {videos.length > 0 && (
              <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((r) => (
                  <ResourceBlock key={r.id} resource={r} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
