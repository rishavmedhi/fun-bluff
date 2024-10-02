"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/Loading";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { useEffect, useRef, useState } from "react";
import Lobby from "./lobby";
import { RoomType, User } from "@/types/collection";
import { fetchLocalLastUsedUserName, fetchUserDeviceId, updateLocalLastUsedUsername } from "@/utils/user.utils";
import CenterContainer from "@/components/CenterContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function StartGame() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState('');
  const [starterUserData, setStarterUserData] = useState<User["Row"] | undefined>(undefined);
  const [roomDetails, setRoomDetails] = useState<RoomType["Row"] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserNameResuse, setIsUserNameResuse] = useState<boolean>(false);
  const { toast } = useToast();
  useEffect(() => {
    if (fetchLocalLastUsedUserName()!.length > 0) {
      setIsUserNameResuse(true);
      setUserName(fetchLocalLastUsedUserName()!)
    }
    if (inputRef.current) {
      console.log(inputRef.current, inputRef.current.focus());

      inputRef.current.focus();
    }
  }, [])

  const initiateStartGameRequest = async () => {
    setLoading(true);
    const deviceId = fetchUserDeviceId();
    updateLocalLastUsedUsername(userName);
    const res = await clientApiFetch('/api/start', {
      method: 'POST',
      body: {
        user_name: userName,
        device_id: deviceId
      }
    })

    // const res = dummyResponse;
    if (!res.error) {
      setStarterUserData(res.data.user[0]);
      setRoomDetails(res.data.room[0]);
    }
    else
      alert("Oops! Something went wrong!");
    setLoading(false);
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomDetails?.room_code!)
    toast({
      'description': "Room code copied to clipboard",
    })
  }

  return (
    <CenterContainer>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Lobby</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6 text-center">
            <Label className="mb-2 text-base" htmlFor="username">Enter your user name</Label>
            <div className="mb-6">
              <Input
                className={`w-full text-lg ${roomDetails ? "text-center" : ""}`}
                name="username"
                onChange={(e) => { setIsUserNameResuse(false); return setUserName(e.target.value) }}
                placeholder="FooBar" 
                readOnly={roomDetails ? true : undefined}
                value={userName}
                ref={inputRef}
              />
              {
                isUserNameResuse &&  !roomDetails &&
                <span className="text-sm text-muted-foreground text-center">Reusing your last username</span>
              }
            </div>
            {
              !roomDetails &&
              <Button onClick={initiateStartGameRequest} className="mt-2">Create Lobby</Button>
            }
          </div>

          {
            roomDetails &&
            <div className="mt-4 mb-4 text-center space-y-2">
              <div className="text-sm font-medium">Room Code</div>
              <div className="text-2xl font-bold">
                <div className="flex justify-center items-center">
                  {roomDetails?.room_code}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyRoomCode}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="h4 mt-2 text-muted-foreground text-sm">Copy and share with your friends to let them join the lobby</div>
            </div>
          }
          <Lobby user={starterUserData} roomDetails={roomDetails} mode={"CREATOR"} roomMemberDetails={starterUserData ? [starterUserData!] : []} />
          {
            loading && <Loading />
          }

        </CardContent>

      </Card>
    </CenterContainer>
  )
}

export default StartGame;