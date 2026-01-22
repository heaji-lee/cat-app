type LoadingSpinnerProps = {
  label?: string
  size?: "sm" | "md" | "lg"
}

export default function LoadingSpinner({
  label = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  }

  return (
    <div className="flex justify-center items-center h-96 w-full">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`animate-spin rounded-full border-t-green-400 border-solid border-gray-200 ${sizeMap[size]}`}
        />
        {label && (
          <p className="text-gray-500 text-lg font-medium">{label}</p>
        )}
      </div>
    </div>
  )
}