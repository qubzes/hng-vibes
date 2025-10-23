"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { Track } from "@/lib/mock-data"

interface ExpandedPlayerProps {
  track: Track | null
  isOpen: boolean
  onClose: () => void
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export function ExpandedPlayer({
  track,
  isOpen,
  onClose,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
}: ExpandedPlayerProps) {
  const [volume, setVolume] = useState(70)

  if (!track) return null

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-screen max-h-screen border-0 bg-background p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
            <div className="w-8" />
            <p className="text-xs font-semibold text-muted-foreground">Now Playing</p>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center gap-8">
              {/* Large Artwork */}
              <div className="h-64 w-64 overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={track.cover_url || "/placeholder.svg"}
                  alt={track.album}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Track Info */}
              <div className="w-full text-center">
                <h2 className="text-2xl font-bold text-foreground">{track.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{track.artists.join(", ")}</p>
              </div>

              {/* Timeline */}
              <div className="w-full">
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-card">
                  <div
                    className="h-full bg-accent transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Details */}
              <div className="w-full space-y-3 rounded-lg border border-border bg-card/50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Album</span>
                  <span className="text-foreground">{track.album}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year</span>
                  <span className="text-foreground">{track.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{formatTime(track.duration_ms)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added by</span>
                  <span className="text-foreground">{track.added_by.name}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Reactions</span>
                  <span className="text-foreground">
                    👍 {track.reactions.like} • 🔥 {track.reactions.fire} • 💜 {track.reactions.heart}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-border px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-4">
              {/* Volume */}
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider value={[volume]} max={100} step={1} onValueChange={(v) => setVolume(v[0])} />
              </div>

              {/* Transport */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="lg" onClick={onPrev} className="h-12 w-12 p-0">
                  <SkipBack className="h-6 w-6" />
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={onPlayPause}
                  className="h-14 w-14 p-0 bg-accent hover:bg-accent/90"
                >
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                </Button>
                <Button variant="ghost" size="lg" onClick={onNext} className="h-12 w-12 p-0">
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
