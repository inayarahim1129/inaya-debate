function videoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.pathname.startsWith("/watch")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    return null;
  } catch {
    return null;
  }
}

export default function YouTubeCard({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string | null;
}) {
  const id = videoId(url);
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
      {id ? (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="block bg-ink-50 p-6 text-ink-600 underline">
          Watch: {title}
        </a>
      )}
      <div className="p-4">
        <h4 className="font-semibold text-ink-900">{title}</h4>
        {description && <p className="mt-1 text-sm text-ink-600">{description}</p>}
      </div>
    </div>
  );
}
