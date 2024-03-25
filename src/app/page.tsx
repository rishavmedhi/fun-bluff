import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home(){
  return(
    <div>
      <h1>Welcome to Psych</h1>
      <Link href="/start">
        <Button>Start</Button>
      </Link>
      <Link href="/join">
        <Button>Join</Button>
      </Link>
    </div>
  )
}