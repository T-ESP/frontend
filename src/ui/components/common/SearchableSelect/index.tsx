import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

const PAGE_SIZE = 10;

export function SearchableSelect({
  options,
  value,
  placeholder = 'Sélectionner...',
  searchPlaceholder = 'Rechercher...',
  onChange,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const visible = filtered.slice(0, visibleCount);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
    }
  }, [filtered.length]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch('');
      setVisibleCount(PAGE_SIZE);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm whitespace-nowrap outline-none transition-colors',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          !selectedLabel && 'text-muted-foreground',
        )}
      >
        <span className="line-clamp-1">{selectedLabel ?? placeholder}</span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-[200] w-full min-w-[180px] rounded-lg border bg-popover shadow-md ring-1 ring-foreground/10">
          <div className="flex items-center gap-1.5 border-b px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-[200px] overflow-y-auto p-1"
          >
            {visible.length === 0 ? (
              <p className="py-2 text-center text-xs text-muted-foreground">Aucun résultat</p>
            ) : (
              visible.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted',
                    value === option.value && 'bg-muted font-medium',
                  )}
                >
                  <Check
                    className={cn(
                      'size-3.5 shrink-0',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="line-clamp-1">{option.label}</span>
                </button>
              ))
            )}
          </div>

          {filtered.length > visibleCount && (
            <p className="border-t px-3 py-1.5 text-center text-xs text-muted-foreground">
              {filtered.length - visibleCount} de plus — continuez à défiler
            </p>
          )}
        </div>
      )}
    </div>
  );
}
