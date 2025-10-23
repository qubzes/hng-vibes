"use client"
import { Search, Filter, ArrowUpDown, RotateCcw, Copy, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn, formatAddedTime } from "@/lib/utils"
import type { Track } from "@/lib/mock-data"

interface TopBarProps {
  onSearch: (query: string) => void
  onSort: (sortBy: string) => void
  onToggleFilters: () => void
  onReset: () => void
  currentSort: string
  searchQuery: string
  tracks: Track[]
  genres: string[]
  selectedGenres: string[]
  onGenreToggle: (genre: string) => void
  showFilters: boolean
}

export function TopBar({
  onSearch,
  onSort,
  onToggleFilters,
  onReset,
  currentSort,
  searchQuery,
  tracks,
  genres,
  selectedGenres,
  onGenreToggle,
  showFilters,
}: TopBarProps) {
  const { toast } = useToast()

  const sortLabels: Record<string, string> = {
    newest: "Newest",
    oldest: "Oldest",
    "most-reacted": "Most Reacted",
    "a-z": "A → Z",
  }

  const totalReactions = tracks.reduce(
    (sum, track) => sum + track.reactions.like + track.reactions.fire + track.reactions.heart,
    0,
  )

  const lastAdded = tracks.length > 0 ? tracks[0].added_at : null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Playlist link copied to clipboard",
    })
  }

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-border px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* Artwork Mosaic */}
            <div className="shrink-0">
              <div className="grid h-32 w-32 grid-cols-2 gap-1 overflow-hidden rounded-lg bg-card">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={tracks[i]?.cover_url || "/placeholder.svg?height=64&width=64&query=album art"}
                    alt="Album art"
                    className="h-full w-full object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Playlist Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">HNG Vibes</h1>
                <p className="mt-1 text-xs text-muted-foreground">HNG Community • #music</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{tracks.length} tracks</span>
                  <span>{totalReactions} reactions</span>
                  {lastAdded && <span>Last added {formatAddedTime(lastAdded)}</span>}
                  <span>{new Set(tracks.flatMap((t) => t.added_by.name)).size} contributors</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleCopyLink} variant="default" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy Link</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Spotify</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="border-b border-border px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onToggleFilters} className="gap-2" title="Toggle filters">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Filters</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2" title="Sort options">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">{sortLabels[currentSort] || "Sort"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onSort("newest")}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSort("oldest")}>Oldest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSort("most-reacted")}>Most Reacted</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSort("a-z")}>A → Z</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={onReset} className="gap-2" title="Reset all filters">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="border-b border-border px-4 py-3 sm:px-6">
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
                        ✕
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
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
                        : "border border-border bg-card text-foreground hover:border-border/80 hover:bg-card/80",
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
