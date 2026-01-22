import { useEffect, useState, useRef } from "react"
import { fetchFavouriteCats, fetchRandomCatImage, type CatImage } from "../api/cats"
import { Card } from "@heroui/react"
import soundFile from "../assets/sounds/sound.mp3"
import RandomCatCard from "../components/RandomCat"
import LoadingSpinner from "../components/LoadingSpinner"
import CatModal from "../components/CatModal"

export default function Favourites() {
  // State
  const [favouriteCats, setFavouriteCats] = useState<CatImage[]>([])
  const [randomCat, setRandomCat] = useState<CatImage | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const cats = await fetchFavouriteCats()
        setFavouriteCats(cats)
      } catch (error) {
        console.error("Error fetching favourite cats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFavourites()
  }, [])

  useEffect(() => {
    if (!loading && favouriteCats.length === 0) {
      fetchRandomCatImage().then(setRandomCat)
    }
  }, [loading, favouriteCats])

  useEffect(() => {
    if (!randomCat) return 
    const audio = new Audio(soundFile)
    audioRef.current = audio
    audio.play()

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [randomCat])

  const showRandomCat = !loading && favouriteCats.length === 0 && randomCat

  return (
    <div className="h-full flex flex-col p-4">
      <h1 className="pb-5">View your favourite cats 🐈</h1>

      <div className="flex-1 mt-4 p-6">
        {loading && <LoadingSpinner label="Loading favourite cats..." />}

        {showRandomCat && (
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
          <CatModal
            cat={selectedCat}
            onClose={() => setSelectedCat(null)}
          />
        )}
      </div>
    </div>
  )
}