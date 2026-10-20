import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#eef0f2"/><text x="50%" y="50%" fill="#5f6b76" font-family="sans-serif" font-size="20" text-anchor="middle">No image available</text></svg>'
  );

// Shows a placeholder when a recipe has no image or the image doesn't load.
export default function RecipeImage({ src, alt = "", className }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={className}
      src={!src || failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
