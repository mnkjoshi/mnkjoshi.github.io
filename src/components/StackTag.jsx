import { LOGO_MAP } from "../data/assetMap";

export default function StackTag({ title, logo }) {
  const src = logo !== undefined ? LOGO_MAP[logo] : null;

  return (
    <span className="inline-flex items-center gap-1.5 bg-white/[0.04] text-text_muted rounded-md px-2 py-1 text-[11px] font-fira border border-white/[0.06]">
      {src && (
        <img
          src={src}
          alt={title}
          className="w-3.5 h-3.5 object-contain"
        />
      )}
      {title}
    </span>
  );
}
