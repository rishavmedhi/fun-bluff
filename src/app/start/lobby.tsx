import { RocketIcon } from "@radix-ui/react-icons";
import LobbyCard from "@/components/LobbyCard";
import { Button } from "@/components/ui/button";
import { RoomType, User } from "@/types/collection";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { supabase } from "@/utils/supabase/server";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const dummySubscribePayload = {
  "schema": "public",
  "table": "room_user_mapping",
  "commit_timestamp": "2024-03-26T14:23:55.045Z",
  "eventType": "INSERT",
  "new": {
    "created_at": "2024-03-26T14:23:55.043254+00:00",
    "id": 11,
    "room_id": 21,
    "user_id": 25
  },
  "old": {},
  "errors": null
}

interface LobbyProps {
  user: User["Row"] | undefined,
  roomDetails: RoomType["Row"] | undefined,
  mode: "CREATOR" | "JOINER",
  roomMemberDetails?: User["Row"][] | undefined
}

function Lobby({ user, roomDetails, mode, roomMemberDetails }: LobbyProps) {
  const [lobbyUsers, setLobbyUsers] = useState<User["Row"][]>([]);

  const { toast } = useToast()

  useEffect(() => {
    if (roomDetails) {
      const channel = supabase.channel("realtime room changes").on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'room_user_mapping'
      }, async (payload) => {
        console.log(payload);
        if (payload.new && payload.new.room_id === roomDetails!.id) {
          const userDetails = await clientApiFetch(`/api/user/${payload.new.user_id}`, { method: 'GET' })
          if (!userDetails.error) {
            let tempLobbyUsers = [...lobbyUsers];
            tempLobbyUsers.push(userDetails.data);
            setLobbyUsers(tempLobbyUsers);
          }
        }
      }).subscribe();

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [roomDetails, lobbyUsers])

  useEffect(() => {
    if (roomMemberDetails && roomMemberDetails.length > 0 && lobbyUsers.length === 0) {
      const tempLobbyUsers = [...roomMemberDetails];
      setLobbyUsers(tempLobbyUsers)
    }
  }, [roomMemberDetails, lobbyUsers])

  function startGame(){
    if(lobbyUsers.length<2){
      toast({
        'description': "It's just you in the lobby. Add more players to start",
      })
    }
  }


  return (
    <>
      {
        lobbyUsers.length > 0 &&
        <>
          <div className="text-lg font-semibold mt-8">Lobby Members</div>
          <div className="mt-4">
            {
              lobbyUsers.map((user, index) => <LobbyCard key={index} username={user.user_name} />)
            }
          </div>
          <Button onClick={startGame}>Start <RocketIcon className="mr-2 h-4 w-4" /></Button>
        </>
      }
      
    </>
  )
}

export default Lobby;