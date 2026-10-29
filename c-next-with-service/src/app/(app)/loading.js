export default function AppLoading() {
  return (
    <output aria-label="Memuat" aria-busy="true" className="block">
      <div className="sticky top-0 z-20 flex h-[53px] items-center border-b border-line bg-background/85 px-4 backdrop-blur-md">
        <div className="h-5 w-28 animate-pulse rounded bg-line" />
      </div>
      <div className="flex gap-3 border-b border-line px-4 py-4">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-line" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-line" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="flex gap-3 border-b border-line px-4 py-4">
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-line" />
          <div className="flex-1 space-y-2.5">
            <div className="h-3.5 w-2/5 animate-pulse rounded bg-line" />
            <div className="h-3.5 w-full animate-pulse rounded bg-line" />
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-line" />
            <div className="flex gap-8 pt-1">
              <div className="h-3.5 w-8 animate-pulse rounded bg-line" />
              <div className="h-3.5 w-8 animate-pulse rounded bg-line" />
            </div>
          </div>
        </div>
      ))}
    </output>
  );
}
