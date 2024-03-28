import {
  Card
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LobbyCardProps {
  username: string | undefined;
}

function LobbyCard({ username }: LobbyCardProps) {
  return (
    <Card className="mb-4">
      <div className="px-4 py-4 flex items-center">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{username?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="pl-4">{username}</div>
      </div>
    </Card>
  )
}

export default LobbyCard;