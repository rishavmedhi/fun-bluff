"use client"

import OtpInput from "@/app/join/components/OtpInput";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import Lobby from "../start/lobby";
import { RoomType, User } from "@/types/collection";

export default function JoinGame() {
  const [userName, setUserName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [userData, setUserData] = useState<User["Row"] | undefined>(undefined);
  const [roomDetails, setRoomDetails] = useState<RoomType["Row"] | undefined>(undefined);
  const [roomMemberDetais, setRoomMemberDetails] = useState<User["Row"][] | undefined>(undefined); 

  const { toast } = useToast()

  async function initiateJoinGame(){
    if(!userName || !roomCode){
      toast({
        'description': "Required details are missing.",
        'variant': 'destructive'
      })
      return ;
    }

    const res = await clientApiFetch("/api/join", {
      method: 'POST',
      body: {
        user_name: userName,
        device_id: fetchUserDeviceId(),
        room_code: roomCode
      }
    })

    console.log(res);

    if(res.error){
      toast({
        'description': res.message,
        'variant': 'destructive'
      })
      return;
    }

    if(!res.error){
      toast({
        'description': res.message,
      });
      setUserData(res.data.user[0]);
      setRoomDetails(res.data.roomDetails[0]);
      setRoomMemberDetails(res.data.memberDetails);
    }
  }

  return (
    <div>
      <h1>Join Game</h1>
      <Label htmlFor="username">Enter your user name</Label>
      <Input name="username" onChange={(e) => setUserName(e.target.value)} />
      <OtpInput onValueChange={(value: string) => setRoomCode(value.toUpperCase())} value={roomCode} />
      <Button onClick={initiateJoinGame}>Join Game</Button>
      <Lobby user={userData} roomDetails={roomDetails} mode="JOINER" roomMemberDetails={roomMemberDetais}/>
    </div>
  )
}