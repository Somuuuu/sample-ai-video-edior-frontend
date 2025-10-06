"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Video, Music, Type } from "lucide-react"

interface VideoClip {
  id: string
  file: File
  url: string
  startTime: number
  endTime: number
  duration: number
  speed: number
  volume: number
}

interface AudioClip {
  id: string
  file: File
  url: string
  volume: number
}

interface TimelineProps {
  currentTime: number
  duration: number
  onTimeChange: (time: number) => void
  videoClips: VideoClip[]
  audioClips: AudioClip[]
  selectedClipId: string | null
  onSelectClip: (id: string) => void
}

export default function Timeline({
  currentTime,
  duration,
  onTimeChange,
  videoClips,
  audioClips,
  selectedClipId,
  onSelectClip,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0) return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration

    onTimeChange(Math.max(0, Math.min(duration, newTime)))
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current || duration === 0) return
    handleTimelineClick(e)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-primary/30 bg-card px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">Timeline</span>
          <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-xs hover:bg-primary/10">
            <Plus className="h-3 w-3 text-primary" />
            <span className="text-foreground">Add Track</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs border-primary/30 bg-transparent hover:bg-primary/10"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <span className="text-primary">−</span>
          </Button>
          <span className="text-[10px] text-muted-foreground">Zoom</span>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs border-primary/30 bg-transparent hover:bg-primary/10"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
          >
            <span className="text-primary">+</span>
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-24 border-r border-primary/30 bg-card">
          <div className="flex h-10 items-center gap-2 border-b border-primary/30 px-2">
            <Video className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-foreground">Video</span>
          </div>
          <div className="flex h-10 items-center gap-2 border-b border-primary/30 px-2">
            <Music className="h-3 w-3 text-accent" />
            <span className="text-xs font-medium text-foreground">Audio</span>
          </div>
          <div className="flex h-10 items-center gap-2 border-b border-primary/30 px-2">
            <Type className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Text</span>
          </div>
        </div>

        <div
          className="relative flex-1 overflow-x-auto cursor-pointer"
          ref={timelineRef}
          onClick={handleTimelineClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          {/* Time Ruler */}
          <div className="sticky top-0 z-10 flex h-6 border-b border-primary/30 bg-[var(--timeline-track)]">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 border-r border-primary/20" style={{ width: `${30 * zoom}px` }}>
                <span className="ml-1 text-[10px] text-primary">{i}s</span>
              </div>
            ))}
          </div>

          <div className="flex h-10 items-center border-b border-primary/30 bg-[var(--timeline-bg)] px-2 gap-1">
            {videoClips.map((clip) => (
              <Card
                key={clip.id}
                className={`h-7 cursor-move border-primary/50 bg-primary/20 px-2 py-1 neon-border ${
                  selectedClipId === clip.id ? "ring-2 ring-primary" : ""
                }`}
                style={{ width: `${clip.duration * 30}px` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectClip(clip.id)
                }}
              >
                <p className="truncate text-[10px] font-medium text-foreground">{clip.file.name}</p>
              </Card>
            ))}
          </div>

          <div className="flex h-10 items-center border-b border-primary/30 bg-[var(--timeline-bg)] px-2 gap-1">
            {audioClips.map((audio) => (
              <Card
                key={audio.id}
                className="h-7 cursor-move border-accent/50 bg-accent/20 px-2 py-1"
                style={{ boxShadow: "0 0 5px var(--neon-cyan)", width: "200px" }}
              >
                <p className="truncate text-[10px] font-medium text-foreground">{audio.file.name}</p>
              </Card>
            ))}
          </div>

          {/* Text Track */}
          <div className="flex h-10 items-center border-b border-primary/30 bg-[var(--timeline-bg)] px-2"></div>

          <div
            className="absolute top-0 h-full w-0.5 bg-primary neon-glow pointer-events-none"
            style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
          >
            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary neon-glow" />
          </div>
        </div>
      </div>
    </div>
  )
}
