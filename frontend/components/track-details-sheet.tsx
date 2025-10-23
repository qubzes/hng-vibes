"use client"

import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import type { Track } from "@/lib/mock-data"
import { formatDuration } from "@/lib/utils"

interface TrackDetailsSheetProps {
  track: Track | null
  isOpen: boolean
  onClose: () => void
}

export function TrackDetailsSheet({ track, isOpen, onClose }: TrackDetailsSheetProps) {
  const { toast } = useToast()

  if (!track) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(track.spotify_url)
    toast({
      title: "Link copied",
      description: "Track link copied to clipboard",
    })
  }

  const handleOpenSpotify = () => {
    window.open(track.spotify_url, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Track Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Artwork */}
          <div className="flex justify-center">
            <div className="h-48 w-48 overflow-hidden rounded-lg shadow-lg">
              <img
                src={track.cover_url || "/placeholder.svg"}
                alt={track.album}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Track Info */}
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-foreground">{track.title}</h3>
            <p className="text-sm text-muted-foreground">{track.artists.join(", ")}</p>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 rounded-lg bg-card/50 p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Album</span>
              <span className="text-sm font-medium text-foreground">{track.album}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Year</span>
              <span className="text-sm font-medium text-foreground">{track.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium text-foreground">{formatDuration(track.duration_ms)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Added by</span>
              <span className="text-sm font-medium text-foreground">{track.added_by.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Genres</span>
              <span className="text-sm font-medium text-foreground">{track.genres.join(", ")}</span>
            </div>
          </div>

          {/* Reactions */}
          <div className="rounded-lg bg-card/50 p-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">Reactions</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span>👍</span>
                <span className="text-sm font-medium text-foreground">{track.reactions.like}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="text-sm font-medium text-foreground">{track.reactions.fire}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💜</span>
                <span className="text-sm font-medium text-foreground">{track.reactions.heart}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">React on Slack to add your reaction</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleCopyLink} variant="default" className="flex-1 gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button onClick={handleOpenSpotify} variant="outline" className="flex-1 gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              Spotify
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
