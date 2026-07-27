type BrandMarkProps = {
  large?: boolean;
  compact?: boolean;
};

export default function BrandMark({
  large = false,
  compact = false,
}: BrandMarkProps) {
  const textSize = large ? "text-5xl" : "text-3xl";
  const underlineWidth = large ? "w-28" : "w-20";

  return (
    <div className="inline-flex flex-col items-start">
      <div className="flex items-end gap-2">
        <span className={`${textSize} font-black tracking-tight text-slate-950`}>
          Slotify
        </span>

        <div className="mb-1 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
          <span className={`${underlineWidth} h-[2px] rounded-full bg-cyan-400`} />
        </div>
      </div>

      {!compact && (
        <p className="mt-1 text-sm text-slate-500">
          Smart coworking reservations
        </p>
      )}
    </div>
  );
}