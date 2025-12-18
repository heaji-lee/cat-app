import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, Button, Form, Label, Switch, Spinner, Alert, CloseButton } from "@heroui/react"
import { favouriteCatImage, uploadCatImage } from "../api/cats"
import { useNavigate } from "react-router-dom";

export default function Catdropzone() {
  const navigate = useNavigate()

  // States
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [favourite, setFavourite] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    const image = acceptedFiles[0]

    if (image.size > MAX_FILE_SIZE) {
      setError("This cat is too chonky. Please upload a cat under 5MB.")
      setFile(null)
      setPreview(null)
      return
    }

    setError(null)
    setFile(image)
    setPreview(URL.createObjectURL(image))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    multiple: false,
  })

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    try {
      const cat = await uploadCatImage(file)

      if (favourite) {
        try {
          const favouriteId = await favouriteCatImage(cat)
          if (cat.favourite && favouriteId) {
            cat.favourite.id = favouriteId
          }
        } catch (error) {
          console.error("Error favouriting cat image:", error)
        }
      }
      
      navigate("/", {
        state: { alert: { type: "success", message: "Cat image uploaded successfully! 😺" }, cat },
      });

      setFile(null)
      setPreview(null)
      setFavourite(false)
    } catch (error) {
      console.error("Error uploading cat image:", error)
      setError("Something went wrong, please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-sm p-6">
      <div className="flex flex-col md:grid-cols-2 gap-6">
        <div
          {...getRootProps()}
          className={`aspect-square rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center
            ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"} overflow-hidden`}
        >
          <input {...getInputProps()} />

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <p className="text-center text-gray-500 px-4">
              Click or drop a cat image 🐱
            </p>
          )}
        </div>

        {error && (
          <div className="fixed top-4 right-4 z-50">
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
              <CloseButton onClick={() => setError(null)} />
            </Alert>
          </div>
        )}

        <Form className="flex h-full flex-col gap-4">
          <div className="mt-auto flex flex-col gap-4 items-center justify-between sm:flex-row sm:items-center sm:justify-between">
            <Switch isSelected={favourite} onChange={setFavourite}>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Label className="text-sm">Favourite</Label>
            </Switch>

            <Button
              onClick={handleSubmit}
              isDisabled={!file || loading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading && <Spinner size="sm" className="text-white"/>}
              {loading ? "Uploading..." : "Upload Cat"}
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  )
}