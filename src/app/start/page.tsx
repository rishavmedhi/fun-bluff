"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { useState } from "react";

function StartGame() {
  const [userName, setUserName] = useState('');

  const initiateStartGameRequest = async () => {
    const res = await clientApiFetch('/api/start', {
      method: 'POST',
      body: {
        user_name: userName,
        device_id: "1234"
      }
    })

    alert(res);
  }

  return (
    <div>
      <Label htmlFor="username">Enter your user name</Label>
      <Input name="username" onChange={(e) => setUserName(e.target.value)} />
      <Button onClick={initiateStartGameRequest}>Start Game</Button>
    </div>
  )
}

export default StartGame;