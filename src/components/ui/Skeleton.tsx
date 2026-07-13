export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
  );
}

export default function SkeletonGroup({
  count = 3,
  className,
  wrapperClassName,
}: {
  count?: number;
  className?: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`grid gap-4 grid-cols-2 ${wrapperClassName}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}
