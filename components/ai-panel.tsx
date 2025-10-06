"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Wand2, Scissors, Palette, Volume2, Zap, Send, Bot, Subtitles, Eye, Crop, Layers } from "lucide-react"

export default function AIPanel() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI video editing assistant. Upload a video and tell me what you'd like to do!",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'll help you with that! Processing your request with AI..." },
      ])
    }, 500)
  }

  return (
    <div className="flex h-full flex-col">
      {/* AI Panel Header */}
      <div className="border-b border-primary/30 bg-primary/5 px-4 py-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary neon-text">
          <Sparkles className="h-5 w-5" />
          AI Assistant
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Edit your video using natural language</p>
      </div>

      <div className="border-b border-primary/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Quick AI Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Auto Enhance</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Scissors className="h-5 w-5 text-accent" />
            <span className="text-xs text-foreground">Smart Trim</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Palette className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Color Match</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Volume2 className="h-5 w-5 text-accent" />
            <span className="text-xs text-foreground">Audio Fix</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Subtitles className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Auto Captions</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Eye className="h-5 w-5 text-accent" />
            <span className="text-xs text-foreground">Scene Detect</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Crop className="h-5 w-5 text-primary" />
            <span className="text-xs text-foreground">Smart Crop</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 border-primary/30 bg-primary/5 py-3 hover:bg-primary/10"
          >
            <Layers className="h-5 w-5 text-accent" />
            <span className="text-xs text-foreground">Remove BG</span>
          </Button>
        </div>
      </div>

      <div className="border-b border-primary/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">AI Suggestions</h3>
        <div className="space-y-2">
          <Card className="border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 cursor-pointer transition-colors">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Remove silence</p>
                <p className="text-xs text-muted-foreground mt-1">Detected 12s of silence</p>
              </div>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary hover:bg-primary/20">
                Apply
              </Button>
            </div>
          </Card>
          <Card className="border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 cursor-pointer transition-colors">
            <div className="flex items-start gap-2">
              <Palette className="h-4 w-4 text-accent mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Adjust exposure</p>
                <p className="text-xs text-muted-foreground mt-1">Scene appears underexposed</p>
              </div>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-accent hover:bg-accent/20">
                Apply
              </Button>
            </div>
          </Card>
          <Card className="border-primary/30 bg-primary/5 p-3 hover:bg-primary/10 cursor-pointer transition-colors">
            <div className="flex items-start gap-2">
              <Subtitles className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Add subtitles</p>
                <p className="text-xs text-muted-foreground mt-1">Auto-generate from audio</p>
              </div>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary hover:bg-primary/20">
                Apply
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Chat */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-primary/30 px-4 py-2">
          <h3 className="text-sm font-semibold text-foreground">Chat with AI</h3>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30 neon-glow">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary/20 text-foreground border border-primary/30"
                      : "bg-card text-foreground border border-primary/30"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-primary/30 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask AI to edit your video..."
              className="flex-1 border-primary/30 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            <Button
              size="icon"
              onClick={handleSend}
              className="bg-primary text-background hover:bg-primary/90 neon-glow"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Try: "Remove background noise" or "Add cinematic color grading"
          </p>
        </div>
      </div>
    </div>
  )
}
