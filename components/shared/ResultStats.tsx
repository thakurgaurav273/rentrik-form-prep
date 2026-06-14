import { formatSize, formatDimensions, formatPercent, sizeDirection } from "@/utils/format";
import { TrendingDown, TrendingUp, Maximize2 } from "lucide-react";

interface ResultStatsProps {
  originalSize: number;
  resultSize: number;
  width?: number;
  height?: number;
  format?: string;
}

export function ResultStats({ originalSize, resultSize, width, height, format }: ResultStatsProps) {
  const direction = sizeDirection(originalSize, resultSize);
  const isLarger = direction === "larger";

  return (
    <div
      className={[
        "rounded-lg border p-4",
        isLarger
          ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/40"
          : "bg-accent/5 border-accent/20",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <p className={`text-sm font-semibold mb-3 ${isLarger ? "text-orange-600 dark:text-orange-400" : "text-accent"}`}>
        Result ready
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem
          label="Before"
          value={formatSize(originalSize)}
        />
        <StatItem
          label="After"
          value={formatSize(resultSize)}
          valueClass={isLarger ? "text-orange-600 dark:text-orange-400" : "text-accent"}
          icon={
            isLarger
              ? <TrendingUp className="h-4 w-4 text-orange-500" aria-hidden />
              : <TrendingDown className="h-4 w-4 text-accent" aria-hidden />
          }
        />
        <StatItem
          label={isLarger ? "Increase" : "Saved"}
          value={formatPercent(originalSize, resultSize)}
          valueClass={isLarger ? "text-orange-600 dark:text-orange-400" : "text-accent"}
        />
        {width && height && (
          <StatItem
            icon={<Maximize2 className="h-4 w-4 text-muted-foreground" aria-hidden />}
            label="Dimensions"
            value={formatDimensions(width, height)}
          />
        )}
        {format && (
          <StatItem label="Format" value={format.toUpperCase()} />
        )}
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  icon,
  valueClass = "text-foreground",
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
