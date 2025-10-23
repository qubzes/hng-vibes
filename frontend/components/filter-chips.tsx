"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChipsProps {
  genres: string[]
  selectedGenres: string[]
  onGenreToggle: (genre: string) => void
  onClearAll: () => void
  isVisible: boolean
}

export function FilterChips({ genres, selectedGenres, onGenreToggle, onClearAll, isVisible }: FilterChipsProps) {
  if (!isVisible) return null

  return (
    <div className="border-b border-border/40 px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3">
        {/* Active Filters Strip */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <div
                key={genre}
                className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
              >
                {genre}
                <button
                  onClick={() => onGenreToggle(genre)}
                  className="hover:opacity-70"
                  aria-label={`Remove ${genre} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Genre Chips */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreToggle(genre)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150",
                selectedGenres.includes(genre)
                  ? "border border-accent bg-accent/20 text-accent"
                  : "border border-border/40 bg-card text-foreground hover:border-border hover:bg-card/80",
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
