
import { ImageIcon } from "lucide-react";

type ImagePlaceholderProps = {
  label: string;
  note?: string;
  className?: string;
  number?: string;
};

export default function ImagePlaceholder({
  label,
  note,
  className = "",
  number,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex min-h-48 flex-col justify-between overflow-hidden border border-[#DCE4EC] bg-[#E9EEF3] p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#66778A]">
          <ImageIcon size={14} />
          IMAGE PLACEHOLDER
        </span>

        {number && (
          <span className="text-xs font-semibold text-[#66778A]">
            {number}
          </span>
        )}
      </div>

      <div className="mx-auto flex max-w-xs flex-col items-center gap-3 py-8 text-center">
        <div className="flex size-12 items-center justify-center border border-[#CCD7E2] bg-white/70 text-[#02488F]">
          <ImageIcon size={21} strokeWidth={1.4} />
        </div>

        <p className="text-sm font-semibold text-[#172B42]">{label}</p>

        {note && (
          <p className="text-xs leading-5 text-[#66778A]">{note}</p>
        )}
      </div>

      <span className="text-[9px] font-semibold tracking-[0.2em] text-[#8A9AAA]">
        NUTRIMED
      </span>
    </div>
  );
}
