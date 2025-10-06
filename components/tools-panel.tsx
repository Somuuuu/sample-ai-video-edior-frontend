"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Scissors, Crop, Layers, Volume2, Split, Trash2, Music, Type } from "lucide-react"

interface ToolsPanelProps {
  onTrim: () => void
  onSplit: () => void
  onDelete: () => void
  onSpeedChange: (speed: number) => void
  onVolumeChange: (volume: number) => void
  onAddMusic: () => void
  onAddText: (text: string) => void
  selectedClip?: {
    duration: number
    speed: number
    volume: number
  } | null
  trimStart: number
  trimEnd: number
  onTrimStartChange: (value: number) => void
  onTrimEndChange: (value: number) => void
}

export default function ToolsPanel({
  onTrim,
  onSplit,
  onDelete,
  onSpeedChange,
  onVolumeChange,
  onAddMusic,
  onAddText,
  selectedClip,
  trimStart,
  trimEnd,
  onTrimStartChange,
  onTrimEndChange,
}: ToolsPanelProps) {
  const [textInput, setTextInput] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)

  const handleAddTextClick = () => {
    if (showTextInput && textInput.trim()) {
      onAddText(textInput)
      setTextInput("")
      setShowTextInput(false)
    } else {
      setShowTextInput(true)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4 border-primary/30 bg-card">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Basic Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={onTrim}
            disabled={!selectedClip}
          >
            <Scissors className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Trim</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10">
            <Crop className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Crop</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={onSplit}
            disabled={!selectedClip}
          >
            <Split className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Split</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={onDelete}
            disabled={!selectedClip}
          >
            <Trash2 className="h-5 w-5 text-destructive" />
            <span className="text-xs text-foreground">Delete</span>
          </Button>
        </div>
      </Card>

      <Card className="p-4 border-primary/30 bg-card">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Clip Properties</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Trim Start</Label>
              <span className="font-mono text-xs text-primary">{trimStart.toFixed(1)}s</span>
            </div>
            <Slider
              value={[trimStart]}
              max={selectedClip?.duration || 100}
              step={0.1}
              onValueChange={(value) => onTrimStartChange(value[0])}
              disabled={!selectedClip}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Trim End</Label>
              <span className="font-mono text-xs text-primary">{trimEnd.toFixed(1)}s</span>
            </div>
            <Slider
              value={[trimEnd]}
              max={selectedClip?.duration || 100}
              step={0.1}
              onValueChange={(value) => onTrimEndChange(value[0])}
              disabled={!selectedClip}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">Speed</Label>
              <span className="font-mono text-xs text-primary">{selectedClip?.speed.toFixed(1) || "1.0"}x</span>
            </div>
            <Slider
              value={[((selectedClip?.speed || 1) - 0.25) * 40]}
              max={100}
              step={1}
              onValueChange={(value) => {
                const speed = value[0] / 40 + 0.25
                onSpeedChange(speed)
              }}
              disabled={!selectedClip}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground">
                <Volume2 className="inline h-3 w-3" /> Volume
              </Label>
              <span className="font-mono text-xs text-primary">{selectedClip?.volume || 100}%</span>
            </div>
            <Slider
              value={[selectedClip?.volume || 100]}
              max={100}
              step={1}
              onValueChange={(value) => onVolumeChange(value[0])}
              disabled={!selectedClip}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-primary/30 bg-card">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Merge & Combine</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
          >
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-foreground">Merge Selected Clips</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-accent/30 bg-accent/5 hover:bg-accent/10"
            onClick={onAddMusic}
          >
            <Music className="h-4 w-4 text-accent" />
            <span className="text-foreground">Add Music</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
            onClick={handleAddTextClick}
          >
            <Type className="h-4 w-4 text-primary" />
            <span className="text-foreground">Add Text</span>
          </Button>
          {showTextInput && (
            <div className="space-y-2 pt-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="border-primary/30 bg-background text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTextClick()
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTextClick} className="flex-1 bg-primary text-background">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowTextInput(false)
                    setTextInput("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="border-dashed border-primary/30 p-4 bg-card">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Add More Tools</h3>
        <p className="text-xs text-muted-foreground">Space reserved for additional editing features</p>
      </Card>
    </div>
  )
}
