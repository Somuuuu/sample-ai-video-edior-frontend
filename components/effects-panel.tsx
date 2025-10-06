"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Palette, Sun, Contrast, Droplets, Sparkles } from "lucide-react"

interface EffectsPanelProps {
  onEffectChange: (effects: {
    brightness: number
    contrast: number
    saturation: number
    hue: number
    blur: number
  }) => void
}

export default function EffectsPanel({ onEffectChange }: EffectsPanelProps) {
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [hue, setHue] = useState(0)
  const [blur, setBlur] = useState(0)

  const updateEffect = (key: string, value: number) => {
    const updates: any = { brightness, contrast, saturation, hue, blur }
    updates[key] = value

    if (key === "brightness") setBrightness(value)
    if (key === "contrast") setContrast(value)
    if (key === "saturation") setSaturation(value)
    if (key === "hue") setHue(value)
    if (key === "blur") setBlur(value)

    onEffectChange(updates)
  }

  const applyPreset = (preset: string) => {
    let effects = { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0 }

    switch (preset) {
      case "warm":
        effects = { brightness: 110, contrast: 105, saturation: 120, hue: 10, blur: 0 }
        break
      case "cool":
        effects = { brightness: 100, contrast: 110, saturation: 90, hue: -10, blur: 0 }
        break
      case "vibrant":
        effects = { brightness: 105, contrast: 115, saturation: 150, hue: 0, blur: 0 }
        break
      case "bw":
        effects = { brightness: 100, contrast: 120, saturation: 0, hue: 0, blur: 0 }
        break
      case "vintage":
        effects = { brightness: 95, contrast: 90, saturation: 80, hue: 20, blur: 0 }
        break
      case "cinematic":
        effects = { brightness: 90, contrast: 125, saturation: 110, hue: -5, blur: 0 }
        break
    }

    setBrightness(effects.brightness)
    setContrast(effects.contrast)
    setSaturation(effects.saturation)
    setHue(effects.hue)
    setBlur(effects.blur)
    onEffectChange(effects)
  }

  return (
    <div className="space-y-3 p-3">
      <Card className="p-3 border-primary/30 bg-card">
        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
          <Palette className="h-3 w-3 text-primary" />
          Color Grading
        </h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-foreground">
                <Sun className="inline h-3 w-3" /> Brightness
              </Label>
              <span className="font-mono text-[10px] text-primary">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([v]) => updateEffect("brightness", v)}
              min={0}
              max={200}
              step={1}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-foreground">
                <Contrast className="inline h-3 w-3" /> Contrast
              </Label>
              <span className="font-mono text-[10px] text-primary">{contrast}%</span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={([v]) => updateEffect("contrast", v)}
              min={0}
              max={200}
              step={1}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-foreground">
                <Droplets className="inline h-3 w-3" /> Saturation
              </Label>
              <span className="font-mono text-[10px] text-primary">{saturation}%</span>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={([v]) => updateEffect("saturation", v)}
              min={0}
              max={200}
              step={1}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-foreground">Hue Rotate</Label>
              <span className="font-mono text-[10px] text-primary">{hue}°</span>
            </div>
            <Slider
              value={[hue]}
              onValueChange={([v]) => updateEffect("hue", v)}
              min={-180}
              max={180}
              step={1}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            />
          </div>
        </div>
      </Card>

      {/* Presets */}
      <Card className="p-3 border-primary/30 bg-card">
        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Color Presets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("warm")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-amber-400 to-orange-500" />
            <span className="text-foreground">Warm</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("cool")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-blue-400 to-cyan-500" />
            <span className="text-foreground">Cool</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("vibrant")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-purple-400 to-pink-500" />
            <span className="text-foreground">Vibrant</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("bw")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-gray-400 to-gray-600" />
            <span className="text-foreground">B&W</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("vintage")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-yellow-300 to-amber-400" />
            <span className="text-foreground">Vintage</span>
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-1 border-primary/30 bg-primary/5 hover:bg-primary/10 text-[10px]"
            onClick={() => applyPreset("cinematic")}
          >
            <div className="h-4 w-full rounded bg-gradient-to-r from-teal-400 to-emerald-500" />
            <span className="text-foreground">Cinematic</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
