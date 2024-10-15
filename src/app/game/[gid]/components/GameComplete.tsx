import ContentLoading from "@/components/ContentLoading";
import ResultUserScoreCard from "@/components/ResultUserScoreCard";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { InScoreAPIResponse, InUserScore } from "@/types/api/game/[gid]/score.type";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { useEffect, useState } from "react";

interface Props {
  gid: number,
  userStatus: userStatus
}

function GameComplete({ gid, userStatus }: Props) {
  const [userScores, setUserScores] = useState<InUserScore[]>([]);
  const [fetchScoresLoading, setFetchScoresLoading] = useState<boolean>(false);

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

  return (
    <>
      <div className="text-lg font-semibold">Game Results</div>

      <div className="mt-8">
        {
          fetchScoresLoading ? <ContentLoading loadingText="Loading scores..." /> :
            userScores && userScores.length > 0 ?
              userScores.map((us, index) =>
                <ResultUserScoreCard username={us.user.user_name} key={crypto.randomUUID()} userscore={us.score} position={index + 1} />
              )
              :
              null
        }
      </div>
    </>
  )
}

export default GameComplete;