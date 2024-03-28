"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { useState } from "react";
import Lobby from "./lobby";
import { RoomType, User } from "@/types/collection";
import { fetchUserDeviceId } from "@/utils/user.utils";

function StartGame() {
  const [userName, setUserName] = useState('');
  const [starterUserData, setStarterUserData] = useState<User["Row"] | undefined>(undefined);
  const [roomDetails, setRoomDetails] = useState<RoomType["Row"] | undefined>(undefined);

  const initiateStartGameRequest = async () => {
    const deviceId = fetchUserDeviceId();
    const res = await clientApiFetch('/api/start', {
      method: 'POST',
      body: {
        user_name: userName,
        device_id: deviceId
      }
    })

    // const res = dummyResponse;
    if(!res.error){
      setStarterUserData(res.data.user[0]);
      setRoomDetails(res.data.room[0]);
    }
    else
      alert("Oops! Something went wrong!");
  }

  return (
    <div>
      <Label htmlFor="username">Enter your user name</Label>
      <Input name="username" onChange={(e) => setUserName(e.target.value)} />
      <Button onClick={initiateStartGameRequest}>Start Game</Button>
      <Lobby user={starterUserData} roomDetails={roomDetails} mode={"CREATOR"} roomMemberDetails={[starterUserData!]}/>
    </div>
  )
}

export default StartGame;