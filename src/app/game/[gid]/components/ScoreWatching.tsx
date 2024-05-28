import UserScoreCard from "@/components/UserScoreCard";
import { Button } from "@/components/ui/button";
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
  const [playerReady, setPlayerReady] = useState<boolean>(false);

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
  }, [gid]);

  useEffect(() => {
    if (userStatus && userStatus.score_watching) {
      setPlayerReady(userStatus.score_watching.readyStatus);
    }
  }, [userStatus])

  async function makePlayerReady() {
    const res = await clientApiFetch(`/api/user/ready`, {
      method: 'POST',
      headers: {
        deviceId: fetchUserDeviceId()
      },
      body: {
        gameId: gid
      }
    });

    if (!res.error) {
      setPlayerReady(true)
    }
  }


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
      <div className="flex justify-center">
        {
          userScores && userScores.length > 0 ?
            !playerReady ?

              <Button onClick={makePlayerReady}>I&apos;m Ready</Button>
              :
              <div>Waiting for other players</div>
            :
            null
        }
      </div>
    </>
  )
}

export default ScoreWatching;