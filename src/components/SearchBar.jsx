import { memo, useCallback, useEffect, useRef } from "react";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";

function SearchBar({
  value,
  onChange,
  onClear,
  resultCount = 0,
  totalCount = 0,
  pending = false,
  disabled = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && value) {
        event.preventDefault();
        onClear?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onClear]);

  const handleChange = useCallback((event) => onChange(event.target.value), [onChange]);

  const handleClear = useCallback(() => {
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  const showingSearch = value.trim().length > 0;

  return (
    <section className="w-full">
      <label htmlFor="gallery-search" className="sr-only">
        Search wedding gallery by photo number
      </label>

      <div className="relative">
        <FiSearch
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
          aria-hidden="true"
        />

        <input
          id="gallery-search"
          ref={inputRef}
          type="search"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search by photo number... (Ctrl/Cmd + K)"
          aria-label="Search images by number"
          aria-describedby="gallery-search-status"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-12 text-sm outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {showingSearch && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            {pending ? (
              <FiLoader className="animate-spin" size={18} aria-hidden="true" />
            ) : (
              <FiX size={18} />
            )}
          </button>
        )}
      </div>

      <div
        id="gallery-search-status"
        aria-live="polite"
        className="mt-3 flex items-center justify-between text-sm text-gray-500"
      >
        {showingSearch ? (
          <>
            <span>
              Showing <strong className="text-gray-900">{resultCount}</strong> result
              {resultCount !== 1 ? "s" : ""}
            </span>
            <span>
              Total: <strong className="text-gray-900">{totalCount}</strong>
            </span>
          </>
        ) : (
          <span>
            {totalCount.toLocaleString()} image{totalCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </section>
  );
}

export default memo(SearchBar);
