import {
  Card
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  username: string,
  userscore: number
}

function UserScoreCard({ username, userscore }: Props) {
  return (
    <Card className="mb-4">
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{username?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="pl-4">{username}</div>
        </div>
        <div className="text-2xl font-bold">
          {userscore}
        </div>
      </div>
    </Card>
  )
}

export default UserScoreCard;