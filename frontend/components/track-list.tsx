"use client"

import type { Track } from "@/lib/mock-data"
import { TrackRow } from "./track-row"

interface TrackListProps {
  tracks: Track[]
  playingTrackId: string | null
  onPlay: (track: Track) => void
  onShowDetails: (track: Track) => void
  onClearFilters: () => void
}

export function TrackList({ tracks, playingTrackId, onPlay, onShowDetails, onClearFilters }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">No tracks match your current search/filters.</p>
        <button onClick={onClearFilters} className="text-xs text-accent hover:underline">Clear filters</button>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tracks.map((track) => (
        <TrackRow
          key={track.id}
          track={track}
          isPlaying={playingTrackId === track.id}
          onPlay={onPlay}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  )
}
