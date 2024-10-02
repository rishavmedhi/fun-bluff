import { RocketIcon } from "@radix-ui/react-icons";
import LobbyCard from "@/components/LobbyCard";
import { Button } from "@/components/ui/button";
import { RoomType, User } from "@/types/collection";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { supabase } from "@/utils/supabase/server";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { fetchUserDeviceId } from "@/utils/user.utils";

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
  const router = useRouter();
  const [lobbyUsers, setLobbyUsers] = useState<User["Row"][]>([]);

  const { toast } = useToast()

  useEffect(() => {
    if (roomDetails) {
      const channel = supabase.channel("realtime room game changes")
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'room_user_mapping', filter: 'room_id=eq.'+roomDetails!.id
        }, async (payload) => {
          console.log("realtime room changes", payload);
          if (payload.new && payload.new.room_id === roomDetails!.id) {
            const userDetails = await clientApiFetch(`/api/user/${payload.new.user_id}`, { method: 'GET' })
            if (!userDetails.error) {
              let tempLobbyUsers = [...lobbyUsers];
              tempLobbyUsers.push(userDetails.data);
              setLobbyUsers(tempLobbyUsers);
            }
          }
        })
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'game', filter: 'room_id=eq.'+roomDetails!.id
        }, async (payload) => {
          console.log("realtime game changes", payload);
          if (mode === "JOINER" && payload.new && payload.new.room_id === roomDetails!.id && payload.new.id) {
            router.push('/game/' + payload.new.id);
          }
        }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [roomDetails, lobbyUsers, mode, router])

  useEffect(() => {
    if (roomMemberDetails && roomMemberDetails.length > 0 && lobbyUsers.length === 0) {
      const tempLobbyUsers = [...roomMemberDetails];
      setLobbyUsers(tempLobbyUsers)
    }
  }, [roomMemberDetails, lobbyUsers])

  async function startGame() {
    if (lobbyUsers.length < 2) {
      toast({
        'description': "It's just you in the lobby. Add more players to start",
      })
      return;
    }
    // make API call to start game
    const res = await clientApiFetch("api/start/game", {
      method: 'POST',
      headers: {
        deviceId: fetchUserDeviceId()
      },
      body: {
        roomId: roomDetails?.id
      }
    });
    if (!res.error) {
      router.push('/game/' + res.data.gameId);
    }
    else {
      toast({
        'description': res.message,
        'variant': 'destructive'
      })
    }
  }

  return (
    <>
      {
        lobbyUsers.length > 0 &&
        <>
          <div className="text-lg font-semibold mt-8">Lobby Members</div>
          <div className="mt-4 w-full">
            {
              lobbyUsers.map((user, index) => <LobbyCard key={index} username={user.user_name} />)
            }
          </div>
          <Button onClick={startGame} className="mt-8 gap-2 w-full">Start <RocketIcon className="h-4 w-4" /></Button>
        </>
      }
    </>
  )
}

export default Lobby;