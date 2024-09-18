import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse w-full md:max-w-2xl  flex flex-col gap-5 rounded-xl p-5 border-2 border-zinc-800",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="size-12 rounded-full bg-zinc-800" />
          <div className="flex flex-col gap-2">
            <div className="w-40 h-4 bg-zinc-800 rounded" />
            <div className="w-[120px] h-4 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>

      <div className="w-96 h-4 bg-zinc-800 rounded" />
      <div className="w-full aspect-video bg-zinc-800 rounded-lg" />

      <div className="w-full flex pb-2 border-b-2 border-zinc-800" />

      <div className="w-full flex items-center gap-3 pt-1">
        <div className="size-10 rounded-full bg-zinc-800" />
        <div className="w-11/12 h-8 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export { Skeleton };
