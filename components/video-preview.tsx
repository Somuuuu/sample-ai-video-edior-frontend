"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  startTime: number
  endTime: number
}

interface VideoPreviewProps {
  isPlaying: boolean
  currentTime: number
  onTimeUpdate: (time: number) => void
  videoUrl: string | null
  videoRef: React.RefObject<HTMLVideoElement>
  effects: {
    brightness: number
    contrast: number
    saturation: number
    hue: number
    blur: number
  }
  onLoadedMetadata: (duration: number) => void
  trimStart: number
  trimEnd: number
  textOverlays: TextOverlay[]
}

export default function VideoPreview({
  isPlaying,
  currentTime,
  onTimeUpdate,
  videoUrl,
  videoRef,
  effects,
  onLoadedMetadata,
  trimStart,
  trimEnd,
  textOverlays,
}: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const renderFrame = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext("2d", { willReadFrequently: false })
    if (!ctx) return

    // Apply video effects
    ctx.filter = `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) hue-rotate(${effects.hue}deg) blur(${effects.blur}px)`
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Reset filter for text
    ctx.filter = "none"

    // Draw text overlays
    textOverlays.forEach((overlay) => {
      if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
        ctx.font = `bold ${overlay.fontSize}px sans-serif`
        ctx.fillStyle = overlay.color
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 3
        ctx.textAlign = "center"
        ctx.strokeText(overlay.text, (overlay.x * canvas.width) / 100, (overlay.y * canvas.height) / 100)
        ctx.fillText(overlay.text, (overlay.x * canvas.width) / 100, (overlay.y * canvas.height) / 100)
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !videoUrl) return

    const ctx = canvas.getContext("2d", { willReadFrequently: false })
    if (!ctx) return

    if (isPlaying) {
      const animate = () => {
        renderFrame()
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      renderFrame()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, videoUrl, effects, textOverlays, currentTime, videoRef])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !videoUrl) return

    const handleLoadedData = () => {
      renderFrame()
    }

    video.addEventListener("loadeddata", handleLoadedData)

    // Render frame when not playing
    if (!isPlaying) {
      renderFrame()
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [effects, videoUrl, videoRef, isPlaying, textOverlays, currentTime])

  return (
    <Card className="flex h-full items-center justify-center bg-card border-primary/30 p-2 neon-border">
      <div className="relative aspect-video w-full">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="hidden"
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => onLoadedMetadata(e.currentTarget.duration)}
          />
        )}

        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="h-full w-full rounded-lg border-2 border-primary/50 bg-[var(--timeline-track)] neon-glow"
        />

        {!videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-primary/50 mb-2" />
              <p className="text-sm text-muted-foreground">Import a video to start editing</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 rounded-md border border-primary/30 bg-background/90 px-2 py-1 backdrop-blur-sm">
          <p className="font-mono text-[10px] text-primary">1920 × 1080 • 30fps • AI Enhanced</p>
        </div>
      </div>
    </Card>
  )
}
