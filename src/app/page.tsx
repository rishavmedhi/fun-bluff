"use client"

import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function startButtonClick() {
    router.push('/start');
  }

  function joinButtonClick() {
    router.push('/join');
  }

  return (
    <>
      <div className="absolute h-dvh w-full flex flex-col justify-center items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-20 animate-homepage-text">Guess the best said</h1>
        <div className="w-full flex flex-col items-center gap-5">
          <Button className="text-xl font-bold h-100 w-52 animate-homepage-btn sm:w-1/4" onClick={startButtonClick}>Start</Button>
          <Button className="text-xl font-bold h-100 w-52 animate-homepage-btn sm:w-1/4" variant="outline" onClick={joinButtonClick}>Join</Button>
        </div>
      </div>
      <Footer />
    </>
  )
}