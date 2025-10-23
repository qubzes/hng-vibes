"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Track } from "@/lib/mock-data"
import { formatTime } from "@/lib/utils"

interface PlayerBarProps {
  track: Track | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  onExpand: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  audioRef?: React.RefObject<HTMLAudioElement | null>
}

export function PlayerBar({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onExpand,
  currentTime,
  duration,
  onSeek,
  audioRef,
}: PlayerBarProps) {
  const [volume, setVolume] = useState(70)

  // Connect volume state to audio element
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume, audioRef])

  if (!track) return null

  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 px-4 py-1 sm:px-6">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Left: Track Info */}
          <div className="min-w-0 flex-1 cursor-pointer" onClick={onExpand}>
            <p className="truncate text-sm font-semibold text-foreground">{track.title}</p>
            <p className="truncate text-xs text-muted-foreground">{track.artists.join(", ")}</p>
          </div>

          {/* Center: Transport Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={onPrev} className="h-8 w-8 p-0">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onPlayPause}
              className="h-8 w-8 p-0 bg-accent hover:bg-accent/90"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onNext} className="h-8 w-8 p-0">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Volume & Expand */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider value={[volume]} max={100} step={1} onValueChange={(v) => setVolume(v[0])} className="w-20" />
            <Button variant="ghost" size="sm" onClick={onExpand} className="h-8 w-8 p-0">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile: Expand Only */}
          <div className="flex sm:hidden">
            <Button variant="ghost" size="sm" onClick={onExpand} className="h-8 w-8 p-0">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
