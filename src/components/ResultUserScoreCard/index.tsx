import {
  Card
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrophyIcon } from "lucide-react";

interface Props {
  username: string,
  userscore: number,
  position: number
}

function ResultUserScoreCard({ username, userscore, position }: Props) {
  return (
    <Card className="mb-4">
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold gap-2 text-xs">
            {
              position === 1 &&
              <TrophyIcon className="w-4 h-4 text-yellow-400 animate-bounce" />
            }
            {
              position > 1 && position < 4 &&
              position
            }
          </div>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{username?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>{username}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">
            {userscore}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ResultUserScoreCard;