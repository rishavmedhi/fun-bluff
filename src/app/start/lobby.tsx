import { RoomType, User } from "@/types/collection";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { supabase } from "@/utils/supabase/server";
import { useEffect, useState } from "react";

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
  roomDetails: RoomType["Row"] | undefined
}

function Lobby({ user, roomDetails }: LobbyProps) {
  const [lobbyUsers, setLobbyUsers] = useState<User["Row"][]>([]);

  useEffect(() => {
    // adding the room creator to the list of users
    // if(user){
    //   setLobbyUsers([user])  
    // }
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
  }, [roomDetails,lobbyUsers])
  return (
    <div>

    </div>
  )
}

export default Lobby;