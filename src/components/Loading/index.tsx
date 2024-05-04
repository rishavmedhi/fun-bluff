import { QuestionMarkIcon } from "@radix-ui/react-icons"

/**
 * Loading full screen component
 * @returns 
 */
function Loading() {
  return (
    <div className="absolute h-full w-full top-0 left-0 flex justify-center items-center bg-white text-lg">
      <QuestionMarkIcon className="animate-spin h-5 w-5 mr-2" /> <span className="animate-pulse">Loading</span>
    </div>
  )
}

export default Loading;