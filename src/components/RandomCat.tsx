import { useState, useRef, useEffect } from "react"
import { Card, Button, Tooltip } from "@heroui/react"
import type { CatImage } from "../api/cats"
import soundFile from "../assets/sounds/sound.mp3"

type Props = {
  cat: CatImage
  onRefresh: () => Promise<void>
  context: "favourites" | "home"
}

export default function RandomCatCard({ cat, onRefresh, context }: Props) {
  // States
  const [isPlaying, setIsPlaying] = useState(false)
  const [poppingPlay, setPoppingPlay] = useState(false)
  const [poppingRefresh, setPoppingRefresh] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(soundFile)
    audio.onended = () => setIsPlaying(false)
    audioRef.current = audio
  }, [cat])

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      setPoppingPlay(true)
      setTimeout(() => setPoppingPlay(false), 200)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const stopWithAnimation = () => {
    handleStop()
    setPoppingPlay(true)
    setTimeout(() => setPoppingPlay(false), 200)
  }

  const handleRefresh = async () => {
    handleStop()
    setPoppingRefresh(true)
    setTimeout(() => setPoppingRefresh(false), 200)
    await onRefresh()
  }

  const message =
    context === "favourites"
      ? "You don't have any favourite cats yet 🐱"
      : "Here's a random cat in the meantime 🐱"

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p className="text-gray-500 text-center">{message}</p>
      <div className="w-72">
        <Card className="relative aspect-square overflow-hidden">
          <img
            src={cat.url}
            alt="Random Cat"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Card>
      </div>
      <div className="flex gap-2 mt-2">
        <div className={`transition-transform duration-200 ease-out ${poppingPlay ? "scale-500" : "scale-200"}`}>
          <Tooltip delay={0}>
            <Button
              variant="ghost"
              isIconOnly
              onClick={isPlaying ? stopWithAnimation : handlePlay}
              className="hover:bg-transparent"
            >
              {isPlaying ? "⏹️" : "▶️"}
            </Button>
            <Tooltip.Content>{isPlaying ? "Had enough? 😹" : "Click me if you must... 🙀"}</Tooltip.Content>
          </Tooltip>
        </div>
        <div className={`transition-transform duration-200 ease-out ${poppingRefresh ? "scale-500" : "scale-200"}`}>
          <Tooltip delay={0}>
            <Button
              variant="ghost"
              isIconOnly
              onClick={handleRefresh}
              className="hover:bg-transparent"
            >
              🔄
            </Button>
            <Tooltip.Content>Get a new cat 🐱</Tooltip.Content>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}