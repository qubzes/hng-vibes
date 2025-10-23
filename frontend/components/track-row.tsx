"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Track } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface TrackRowProps {
  track: Track
  isPlaying: boolean
  onPlay: (track: Track) => void
  onShowDetails: (track: Track) => void
}

export function TrackRow({ track, isPlaying, onPlay, onShowDetails }: TrackRowProps) {
  const { toast } = useToast()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(track.spotify_url)
    toast({
      title: "Link copied",
      description: "Track link copied to clipboard",
    })
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  const formatAddedTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      onClick={() => onPlay(track)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 transition-all duration-200 sm:px-6",
        "hover:bg-card/60 hover:shadow-sm",
        isPlaying && "bg-card/40 shadow-sm",
      )}
    >
      {isPlaying && <div className="absolute left-0 top-0 h-full w-1.5 bg-accent" />}

      {/* Album Art */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-card transition-transform duration-200 group-hover:scale-105">
        <img src={track.cover_url || "/placeholder.svg"} alt={track.album} className="h-full w-full object-cover" />
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1">
          <p
            className={cn("truncate text-sm font-semibold transition-colors duration-200", isPlaying && "text-accent")}
          >
            {track.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {track.artists.join(", ")} • {track.album} ({track.year})
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <img
              src={track.added_by.avatar || "/placeholder.svg"}
              alt={track.added_by.name}
              className="h-3 w-3 rounded-full"
            />
            <span>{track.added_by.name}</span>
            <span>•</span>
            <span>{formatAddedTime(track.added_at)}</span>
          </div>
        </div>
      </div>

      {/* Reactions */}
      <div className="hidden flex-shrink-0 gap-3 text-xs text-muted-foreground sm:flex">
        <div className="flex items-center gap-1" title="React on Slack">
          <span>👍</span>
          <span>{track.reactions.like}</span>
        </div>
        <div className="flex items-center gap-1" title="React on Slack">
          <span>🔥</span>
          <span>{track.reactions.fire}</span>
        </div>
        <div className="flex items-center gap-1" title="React on Slack">
          <span>💜</span>
          <span>{track.reactions.heart}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="hidden flex-shrink-0 text-xs text-muted-foreground sm:block">
        {formatDuration(track.duration_ms)}
      </div>

      {/* Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onShowDetails(track)}>View Details</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>Copy Track Link</DropdownMenuItem>
          <DropdownMenuItem>Open in Spotify</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
