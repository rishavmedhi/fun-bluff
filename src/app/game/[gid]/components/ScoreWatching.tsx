import UserScoreCard from "@/components/UserScoreCard";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { useEffect, useState } from "react";
import ContentLoading from "@/components/ContentLoading";
import WaitingForPlayers from "@/components/text/WaitingForPlayers";
import Button from "@/components/Button";

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
  const [fetchScoresLoading, setFetchScoresLoading] = useState<boolean>(false);
  const [readyBtnClickLoading, setReadyBtnClickLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchGameScores() {
      setFetchScoresLoading(true);
      const res: InScoreAPIResponse = await clientApiFetch(`/api/game/${gid}/score`, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        setUserScores(res.data.score)
      }
      setFetchScoresLoading(false);
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
    setReadyBtnClickLoading(true);
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
    setReadyBtnClickLoading(false);
  }


  return (
    <>
      <div className="mt-8">
        {
          fetchScoresLoading ? <ContentLoading loadingText="Loading scores..." /> :
            userScores && userScores.length > 0 ?
              userScores.map((us) =>
                <UserScoreCard username={us.user.user_name} key={crypto.randomUUID()} userscore={us.score} />
              )
              :
              null
        }
      </div>
      {
        !fetchScoresLoading &&
        <div className="flex justify-center mt-12">
          {
            userScores && userScores.length > 0 ?
              !playerReady ?
                <Button onClick={makePlayerReady} isLoading={readyBtnClickLoading}>I&apos;m Ready</Button>
                :
                <WaitingForPlayers />
              :
              null
          }
        </div>
      }
    </>
  )
}

export default ScoreWatching;