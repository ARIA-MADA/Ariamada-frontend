import type { SyntheticEvent } from "react";

const PROJECT_IMAGE_FALLBACK = "/images/approche.avif";

export function ProjectImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src?: string | null;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
}) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.getAttribute("src") === PROJECT_IMAGE_FALLBACK) {
      image.hidden = true;
      return;
    }
    image.src = PROJECT_IMAGE_FALLBACK;
  };

  return (
    <img
      src={src || PROJECT_IMAGE_FALLBACK}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={className}
    />
  );
}
