"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Upload,
  Undo,
  Redo,
  Settings,
  Sparkles,
  Download,
  Film,
} from "lucide-react"
import VideoPreview from "@/components/video-preview"
import Timeline from "@/components/timeline"
import ToolsPanel from "@/components/tools-panel"
import EffectsPanel from "@/components/effects-panel"
import AIPanel from "@/components/ai-panel"

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

interface EditorState {
  videoClips: VideoClip[]
  audioClips: AudioClip[]
  textOverlays: TextOverlay[]
  videoEffects: {
    brightness: number
    contrast: number
    saturation: number
    hue: number
    blur: number
  }
}

export default function VideoEditor() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeTab, setActiveTab] = useState<"tools" | "effects">("tools")
  const [videoClips, setVideoClips] = useState<VideoClip[]>([])
  const [audioClips, setAudioClips] = useState<AudioClip[]>([])
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("Untitled Project")
  const [videoEffects, setVideoEffects] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
  })
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)

  const [history, setHistory] = useState<EditorState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  const saveToHistory = useCallback(() => {
    const currentState: EditorState = {
      videoClips,
      audioClips,
      textOverlays,
      videoEffects,
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(currentState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [videoClips, audioClips, textOverlays, videoEffects, history, historyIndex])

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setVideoClips(prevState.videoClips)
      setAudioClips(prevState.audioClips)
      setTextOverlays(prevState.textOverlays)
      setVideoEffects(prevState.videoEffects)
      setHistoryIndex(historyIndex - 1)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setVideoClips(nextState.videoClips)
      setAudioClips(nextState.audioClips)
      setTextOverlays(nextState.textOverlays)
      setVideoEffects(nextState.videoEffects)
      setHistoryIndex(historyIndex + 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file)
      const video = document.createElement("video")
      video.src = url
      video.onloadedmetadata = () => {
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          file,
          url,
          startTime: 0,
          endTime: video.duration,
          duration: video.duration,
          speed: 1,
          volume: 100,
        }
        setVideoClips((prev) => [...prev, newClip])
        setSelectedClipId(newClip.id)
        setTrimEnd(video.duration)
        setProjectName(file.name.replace(/\.[^/.]+$/, ""))
        saveToHistory()
      }
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file)
      const newAudio: AudioClip = {
        id: `audio-${Date.now()}`,
        file,
        url,
        volume: 80,
      }
      setAudioClips((prev) => [...prev, newAudio])
      saveToHistory()
    }
  }

  const handleTrim = () => {
    if (!selectedClipId) return
    const clip = videoClips.find((c) => c.id === selectedClipId)
    if (!clip) return

    setVideoClips((prev) =>
      prev.map((c) =>
        c.id === selectedClipId
          ? {
              ...c,
              startTime: trimStart,
              endTime: trimEnd,
              duration: trimEnd - trimStart,
            }
          : c,
      ),
    )
    saveToHistory()
  }

  const handleSplit = () => {
    if (!selectedClipId || currentTime === 0) return
    const clip = videoClips.find((c) => c.id === selectedClipId)
    if (!clip) return

    const clip1: VideoClip = {
      ...clip,
      id: `clip-${Date.now()}-1`,
      endTime: currentTime,
      duration: currentTime - clip.startTime,
    }

    const clip2: VideoClip = {
      ...clip,
      id: `clip-${Date.now()}-2`,
      startTime: currentTime,
      duration: clip.endTime - currentTime,
    }

    setVideoClips((prev) => prev.map((c) => (c.id === selectedClipId ? clip1 : c)).concat(clip2))
    saveToHistory()
  }

  const handleDelete = () => {
    if (!selectedClipId) return
    setVideoClips((prev) => prev.filter((c) => c.id !== selectedClipId))
    setSelectedClipId(null)
    saveToHistory()
  }

  const handleSpeedChange = (speed: number) => {
    if (!selectedClipId) return
    setVideoClips((prev) => prev.map((c) => (c.id === selectedClipId ? { ...c, speed } : c)))
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const handleVolumeChange = (volume: number) => {
    if (!selectedClipId) return
    setVideoClips((prev) => prev.map((c) => (c.id === selectedClipId ? { ...c, volume } : c)))
    if (videoRef.current) {
      videoRef.current.volume = volume / 100
    }
  }

  const handleAddText = (text: string) => {
    const newText: TextOverlay = {
      id: `text-${Date.now()}`,
      text,
      x: 50,
      y: 50,
      fontSize: 48,
      color: "#00ff88",
      startTime: currentTime,
      endTime: currentTime + 5,
    }
    setTextOverlays((prev) => [...prev, newText])
    saveToHistory()
  }

  const handleExport = () => {
    alert("Export functionality: Your video will be rendered with all applied effects and AI enhancements!")
  }

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        // Wait for any pending play promise before pausing
        if (playPromiseRef.current) {
          try {
            await playPromiseRef.current
          } catch (error) {
            // Ignore errors from interrupted play
          }
        }
        videoRef.current.pause()
        if (audioRef.current) audioRef.current.pause()
        playPromiseRef.current = null
      } else {
        // Store the play promise
        playPromiseRef.current = videoRef.current.play().catch((error) => {
          // Handle play errors gracefully
          console.error("[v0] Play error:", error)
          setIsPlaying(false)
        })

        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("[v0] Audio play error:", error)
          })
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const selectedClip = videoClips.find((c) => c.id === selectedClipId)
  const currentVideoUrl = selectedClip?.url || null

  return (
    <div className="flex min-h-screen justify-center bg-background">
      <div className="flex w-full max-w-[1440px] flex-col h-screen overflow-hidden">
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
        <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />

        {audioClips.length > 0 && (
          <audio ref={audioRef} src={audioClips[0].url} loop volume={audioClips[0].volume / 100} />
        )}

        <header className="flex items-center justify-between border-b border-primary/30 bg-card px-4 py-2 neon-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border-2 border-primary neon-glow">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-sans text-xl font-bold text-primary neon-text">AI VIDEO DIRECTOR</h1>
            </div>
            <Separator orientation="vertical" className="h-5 bg-primary/30" />
            <span className="text-xs text-muted-foreground">{projectName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              title="Undo (Ctrl+Z)"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              title="Redo (Ctrl+Y)"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4 text-primary" />
            </Button>
            <Separator orientation="vertical" className="h-5 bg-primary/30" />
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-primary/30 hover:bg-primary/10 bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1 h-3 w-3 text-primary" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-accent/30 hover:bg-accent/10 bg-transparent"
              onClick={handleExport}
            >
              <Download className="mr-1 h-3 w-3 text-accent" />
              Export
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs ai-gradient text-background font-semibold hover:opacity-90 pulse-glow"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              AI Edit
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Tools & Effects */}
          <aside className="w-64 border-r border-primary/30 bg-card overflow-y-auto">
            <div className="flex border-b border-primary/30">
              <button
                onClick={() => setActiveTab("tools")}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "tools"
                    ? "border-b-2 border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                Tools
              </button>
              <button
                onClick={() => setActiveTab("effects")}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === "effects"
                    ? "border-b-2 border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                Effects
              </button>
            </div>

            <div className="h-[calc(100%-41px)] overflow-y-auto">
              {activeTab === "tools" ? (
                <ToolsPanel
                  onTrim={handleTrim}
                  onSplit={handleSplit}
                  onDelete={handleDelete}
                  onSpeedChange={handleSpeedChange}
                  onVolumeChange={handleVolumeChange}
                  onAddMusic={() => audioInputRef.current?.click()}
                  onAddText={handleAddText}
                  selectedClip={selectedClip}
                  trimStart={trimStart}
                  trimEnd={trimEnd}
                  onTrimStartChange={setTrimStart}
                  onTrimEndChange={setTrimEnd}
                />
              ) : (
                <EffectsPanel onEffectChange={setVideoEffects} />
              )}
            </div>
          </aside>

          {/* Center - Video Preview & Timeline */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 bg-background p-3 overflow-hidden">
              <VideoPreview
                isPlaying={isPlaying}
                currentTime={currentTime}
                onTimeUpdate={setCurrentTime}
                videoUrl={currentVideoUrl}
                videoRef={videoRef}
                effects={videoEffects}
                onLoadedMetadata={(duration) => setDuration(duration)}
                trimStart={trimStart}
                trimEnd={trimEnd}
                textOverlays={textOverlays}
              />
            </div>

            <div className="border-y border-primary/30 bg-card px-4 py-2">
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" title="Previous Frame">
                  <SkipBack className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10 bg-primary text-background hover:bg-primary/90 neon-glow"
                  onClick={togglePlayPause}
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" title="Next Frame">
                  <SkipForward className="h-4 w-4 text-primary" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-primary/30" />
                <div className="font-mono text-xs text-primary">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>

            <div className="h-48 border-t border-primary/30 bg-[var(--timeline-bg)]">
              <Timeline
                currentTime={currentTime}
                duration={duration}
                onTimeChange={(time) => {
                  setCurrentTime(time)
                  if (videoRef.current) {
                    videoRef.current.currentTime = time
                  }
                }}
                videoClips={videoClips}
                audioClips={audioClips}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
              />
            </div>
          </div>

          {/* Right Panel - AI Features */}
          <aside className="w-80 border-l border-primary/30 bg-card overflow-y-auto">
            <AIPanel />
          </aside>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}
