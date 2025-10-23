"use client"

import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Track } from "@/lib/mock-data"

interface PlaylistHeaderProps {
  tracks: Track[]
}

export function PlaylistHeader({ tracks }: PlaylistHeaderProps) {
  const { toast } = useToast()

  const totalReactions = tracks.reduce(
    (sum, track) => sum + track.reactions.like + track.reactions.fire + track.reactions.heart,
    0,
  )

  const lastAdded = tracks.length > 0 ? tracks[0].added_at : null
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Playlist link copied to clipboard",
    })
  }

  return (
    <div className="border-b border-border/40 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Artwork Mosaic */}
        <div className="flex-shrink-0">
          <div className="grid h-40 w-40 grid-cols-2 gap-1 overflow-hidden rounded-lg bg-card">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={tracks[i]?.cover_url || "/placeholder.svg?height=80&width=80&query=album art"}
                alt="Album art"
                className="h-full w-full object-cover"
              />
            ))}
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">HNG Vibes</h2>
            <p className="mt-2 text-sm text-muted-foreground">One community playlist from Slack #music</p>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>{tracks.length} tracks</span>
              <span>{totalReactions} reactions</span>
              {lastAdded && <span>Last added {formatDate(lastAdded)}</span>}
              <span>{new Set(tracks.flatMap((t) => t.added_by.name)).size} contributors</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <Button onClick={handleCopyLink} variant="default" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              Open in Spotify
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
