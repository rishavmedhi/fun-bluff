"use client"

import OtpInput from "@/app/join/components/OtpInput";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import Lobby from "../start/lobby";
import { RoomType, User } from "@/types/collection";
import CenterContainer from "@/components/CenterContainer";
import { FaceIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLocalLastUsedUserName } from "@/utils/user.utils";
import Loading from "@/components/Loading";

export default function JoinGame() {
  const [userName, setUserName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [userData, setUserData] = useState<User["Row"] | undefined>(undefined);
  const [roomDetails, setRoomDetails] = useState<RoomType["Row"] | undefined>(undefined);
  const [roomMemberDetais, setRoomMemberDetails] = useState<User["Row"][] | undefined>(undefined); 
  const [isUserNameResuse, setIsUserNameResuse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast()

  useEffect(() => {
    if (fetchLocalLastUsedUserName()!.length > 0) {
      setIsUserNameResuse(true);
      setUserName(fetchLocalLastUsedUserName()!)
    }
  }, [])

  async function initiateJoinGame() {
    setLoading(true);
    try {
      if (!userName || !roomCode) {
        toast({
          'description': "Required details are missing.",
          'variant': 'destructive'
        })
        return;
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

      if (res.error) {
        toast({
          'description': res.message,
          'variant': 'destructive'
        })
        return;
      }

      if (!res.error) {
        toast({
          'description': res.message,
        });
        setUserData(res.data.user[0]);
        setRoomDetails(res.data.roomDetails[0]);
        setRoomMemberDetails(res.data.memberDetails);
      }
    }
    catch (err) {
      toast({
        'description': "Something went wrong",
        'variant': 'destructive'
      })
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <CenterContainer>
      <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Join Game</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mt-4 mb-5">
            <Label htmlFor="username" className="mb-2 text-base">Enter your user name</Label>
            <Input 
              className="w-full text-lg" 
              name="username" 
              onChange={(e) => { 
                setIsUserNameResuse(false);
                return setUserName(e.target.value);
              }} 
              readOnly={!!roomDetails} 
              value={userName} 
              placeholder="Supaman"/>
            {
              isUserNameResuse &&  !roomDetails &&
              <span className="text-sm text-muted-foreground text-center">Reusing your last username</span>
            }
          </div>
          <div className="w-72 flex justify-center mt-5 mb-8">
            <OtpInput onValueChange={(value: string) => setRoomCode(value.toUpperCase())} value={roomCode} />
          </div>
          {
            !roomDetails && <Button className="gap-2 w-full mt-8" onClick={initiateJoinGame} disabled={loading}>Join Game <FaceIcon className="h-4 w-4" /></Button>
          }
          <Lobby user={userData} roomDetails={roomDetails} mode="JOINER" roomMemberDetails={roomMemberDetais}/>
        </CardContent>
      </Card>
      {
        loading && <Loading />
      }
    </CenterContainer>
  )
}