import { IconSearch } from "@/components/icons";

export function SearchField({
  defaultValue = "",
  autoFocus = false,
  id = "search-input",
  label = "Cari di Kicau",
}) {
  return (
    <form action="/search" className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
        <IconSearch className="size-[18px]" />
      </span>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={label}
        maxLength={100}
        enterKeyHint="search"
        // biome-ignore lint/a11y/noAutofocus: search page opens for searching
        autoFocus={autoFocus}
        className="h-10 w-full rounded-full border border-transparent bg-surface pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:bg-background focus:outline-none"
      />
    </form>
  );
}
