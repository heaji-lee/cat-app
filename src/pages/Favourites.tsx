import { useEffect, useState, useRef } from "react"
import { fetchFavouriteCats, fetchRandomCatImage, type CatImage } from "../api/cats"
import { Button, Card } from "@heroui/react"
import soundFile from "../assets/sounds/sound.mp3"
import RandomCatCard from "../components/RandomCat"

export default function Favourites() {
  // State
  const [favouriteCats, setFavouriteCats] = useState<CatImage[]>([])
  const [randomCat, setRandomCat] = useState<CatImage | null>(null)
  const [, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await fetchFavouriteCats()
        setFavouriteCats(cats)

        if (cats.length === 0 && !randomCat) {
          const random = await fetchRandomCatImage()
          setRandomCat(random)
        }
      } catch (error) {
        console.error("Error fetching favourite cats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (randomCat) {
      const audio = new Audio(soundFile)
      audio.onended = () => setIsPlaying(false)
      audioRef.current = audio
    }
  }, [randomCat])

  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="pb-5">View your favourite cats 🐈</h1>

      <div className="flex-1 mt-4 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400 border-solid"></div>
              <p className="text-gray-500 text-lg font-medium">Loading favourite cats...</p>
            </div>
          </div>
        ) : favouriteCats.length === 0 && randomCat && (
            <RandomCatCard
              cat={randomCat}
              onRefresh={async () => {
                const newCat = await fetchRandomCatImage()
                setRandomCat(newCat)
              }}
              context="favourites"
            />
        )}

        {favouriteCats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">            
            {favouriteCats.map((cat) => (
              <div key={cat.id}>
                <Card className="relative aspect-square overflow-hidden w-[30vw] sm:w-full">
                  <img
                      src={cat.url}
                      alt={`Favourite Cat ${cat.id}`}
                      className="absolute inset-0 h-full w-full object-cover cursor-pointer"
                      onClick={() => setSelectedCat(cat)}
                  />
                </Card>
              </div>
            ))}
          </div>
        )}

        {selectedCat && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedCat(null)}
          >
            <div className="relative">
              <img
                src={selectedCat.url}
                alt={selectedCat.breeds?.[0]?.name ?? "Cat"}
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              />
              <Button
                variant="ghost"
                className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                onClick={(e) => { e.stopPropagation(); setSelectedCat(null); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}