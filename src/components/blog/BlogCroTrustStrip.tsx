import { Check } from "lucide-react";
import type { BlogCroLabels } from "@/lib/blog/cro-labels";

type Props = { cro: BlogCroLabels };

export default function BlogCroTrustStrip({ cro }: Props) {
  return (
    <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-5">
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-700 sm:text-sm">
        {cro.trustStrip.map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {cro.emotionalAboveFold}{" "}
        <span className="font-medium text-gray-800">{cro.localProof}</span>
      </p>
    </div>
  );
}
