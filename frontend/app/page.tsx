"use client"

import { useState, useEffect, useRef } from "react"
import { MOCK_TRACKS, GENRES, type Track } from "@/lib/mock-data"
import { TopBar } from "@/components/top-bar"
import { TrackList } from "@/components/track-list"
import { PlayerBar } from "@/components/player-bar"
import { ExpandedPlayer } from "@/components/expanded-player"
import { TrackDetailsSheet } from "@/components/track-details-sheet"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [expandedPlayerOpen, setExpandedPlayerOpen] = useState(false)
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false)
  const [selectedTrackForDetails, setSelectedTrackForDetails] = useState<Track | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Filter and sort tracks
  const filteredTracks = MOCK_TRACKS.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artists.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some((g) => track.genres.includes(g))

    return matchesSearch && matchesGenre
  }).sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return a.added_at.getTime() - b.added_at.getTime()
      case "most-reacted":
        const aReactions = a.reactions.like + a.reactions.fire + a.reactions.heart
        const bReactions = b.reactions.like + b.reactions.fire + b.reactions.heart
        return bReactions - aReactions
      case "a-z":
        return a.title.localeCompare(b.title)
      case "newest":
      default:
        return b.added_at.getTime() - a.added_at.getTime()
    }
  })

  // Handle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Handle track selection
  const handlePlayTrack = (track: Track) => {
    if (playingTrack?.id === track.id) {
      handlePlayPause()
    } else {
      setPlayingTrack(track)
      setCurrentTime(0)
      setIsPlaying(true)
    }
  }

  // Handle next/prev
  const handleNext = () => {
    if (!playingTrack) return
    const currentIndex = filteredTracks.findIndex((t) => t.id === playingTrack.id)
    if (currentIndex < filteredTracks.length - 1) {
      handlePlayTrack(filteredTracks[currentIndex + 1])
    }
  }

  const handlePrev = () => {
    if (!playingTrack) return
    const currentIndex = filteredTracks.findIndex((t) => t.id === playingTrack.id)
    if (currentIndex > 0) {
      handlePlayTrack(filteredTracks[currentIndex - 1])
    }
  }

  // Handle seek
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Update audio element when track changes
  useEffect(() => {
    if (!audioRef.current || !playingTrack) return

    audioRef.current.src = playingTrack.audio_url
    if (isPlaying) {
      audioRef.current.play()
    }
  }, [playingTrack])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime * 1000)
    const handleLoadedMetadata = () => setDuration(audio.duration * 1000)
    const handleEnded = () => handleNext()

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [playingTrack, filteredTracks])

  // Handle genre toggle
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  // Handle reset
  const handleReset = () => {
    setSearchQuery("")
    setSelectedGenres([])
    setSortBy("newest")
  }

  // Handle show details
  const handleShowDetails = (track: Track) => {
    setSelectedTrackForDetails(track)
    setDetailsSheetOpen(true)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Hidden audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      <TopBar
        onSearch={setSearchQuery}
        onSort={setSortBy}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onReset={handleReset}
        currentSort={sortBy}
        searchQuery={searchQuery}
        tracks={MOCK_TRACKS}
        genres={GENRES}
        selectedGenres={selectedGenres}
        onGenreToggle={handleGenreToggle}
        showFilters={showFilters}
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto max-w-7xl">
          {/* Track List */}
          <TrackList
            tracks={filteredTracks}
            playingTrackId={playingTrack?.id || null}
            onPlay={handlePlayTrack}
            onShowDetails={handleShowDetails}
          />
        </div>
      </div>

      {/* Player Bar */}
      {playingTrack && (
        <PlayerBar
          track={playingTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onExpand={() => setExpandedPlayerOpen(true)}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
      )}

      {/* Expanded Player */}
      <ExpandedPlayer
        track={playingTrack}
        isOpen={expandedPlayerOpen}
        onClose={() => setExpandedPlayerOpen(false)}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* Track Details Sheet */}
      <TrackDetailsSheet
        track={selectedTrackForDetails}
        isOpen={detailsSheetOpen}
        onClose={() => setDetailsSheetOpen(false)}
      />
    </div>
  )
}
