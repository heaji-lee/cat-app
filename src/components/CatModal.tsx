import { Button } from "@heroui/react"
import type { CatImage } from "../api/cats"

type CatModalProps = {
  cat: CatImage
  onClose: () => void
}

export default function CatModal({ cat, onClose }: CatModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={cat.url}
          alt={cat.breeds?.[0]?.name ?? "Cat"}
          className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
        />

        <Button
          variant="ghost"
          className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>
    </div>
  )
}