export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h2 className="font-fira text-sm md:text-base font-medium tracking-wider uppercase text-text_muted">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      {subtitle && (
        <p className="text-text_muted/60 mt-1 text-xs">{subtitle}</p>
      )}
    </div>
  );
}
