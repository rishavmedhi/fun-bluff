import React from 'react'
import { Loader2 } from "lucide-react"

interface ContentLoadingProps {
  loadingText?: string
}

/**
 * A component that displays a loading spinner with optional custom loading text.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.loadingText="Loading..."] - The text to display next to the loading spinner.
 * @returns A div containing a spinning loader icon and the loading text.
 */
const ContentLoading: React.FC<ContentLoadingProps> = ({ loadingText = "Loading..." }: { loadingText?: string }) => {
  return (
    <div className="flex justify-center items-center text-muted-foreground text-sm">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingText}
    </div>
  )
}

export default ContentLoading;