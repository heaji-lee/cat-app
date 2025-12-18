import Catdropzone from "../components/CatDropzone"

export default function Upload() {

  return (
    <div className="h-full flex flex-col p-4">
      <h1>Upload a Cat 🐱</h1>

      <div className="flex-1 flex items-center justify-center">
        <Catdropzone />
      </div>
    </div>
  )
}