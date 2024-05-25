import UserScoreCard from "@/components/UserScoreCard";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { useEffect, useState } from "react";

interface Props {
  gid: number,
  userStatus: userStatus
}

interface InScoreAPIResponse {
  message: string,
  error: boolean,
  data: InResponseData
}

interface InResponseData {
  score: InUserScore[],
}

interface InUserScore {
  score: number,
  user: InUser
}

interface InUser {
  user_name: string
}

function ScoreWatching({ gid, userStatus }: Props) {
  const [userScores, setUserScores] = useState<InUserScore[]>([]);

  useEffect(() => {
    async function fetchGameScores() {
      const res: InScoreAPIResponse = await clientApiFetch(`/api/game/${gid}/score`, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        setUserScores(res.data.score)
      }
    }

    if (gid)
      fetchGameScores();
  }, [gid])


  return (
    <>
      {
        userScores && userScores.length > 0 ?
          userScores.map((us) =>
            <UserScoreCard username={us.user.user_name} key={crypto.randomUUID()} userscore={us.score} />
          )
          :
          null
      }
    </>
  )
}

export default ScoreWatching;