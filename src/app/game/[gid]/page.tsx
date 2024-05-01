"use client"
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { useEffect, useState } from "react";
import { GameStatusType, QuestionType } from "@/types/collection";
import OptionFilling from "./components/OptionFilling";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";

interface gameStatusResponse {
  message: string,
  data: {
    gameStatus: GameStatusType["Row"],
    questionData: {
      question: QuestionType["Row"]["question"]
    },
    userStatus: userStatus
  },
  error: boolean
}

enum gameStateEnum {
  OPTION_FILLING = 0,
  ANSWER_FILLING = 1,
  SCORE_WATCHING = 2
}

function Game({ params }: { params: { gid: number } }) {
  const [gameStatus, setGameStatus] = useState<GameStatusType["Row"] | undefined>(undefined);
  const [gameState, setGameState] = useState<gameStateEnum>(gameStateEnum.OPTION_FILLING);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userStatus, setUserStatus] = useState<userStatus>({});

  useEffect(() => {
    async function init() {
      const res: gameStatusResponse = await clientApiFetch("/api/game/" + params.gid, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        const resGameStatus = res.data.gameStatus;
        setCurrentQuestion(res.data.questionData.question!);
        setGameStatus(resGameStatus);
        if (resGameStatus.option_filling < 2) {
          setGameState(gameStateEnum.OPTION_FILLING);
        }
        else if (resGameStatus.answer_filling < 2) {
          setGameState(gameStateEnum.ANSWER_FILLING);
        }
        else if (resGameStatus.score_watching < 2) {
          setGameState(gameStateEnum.SCORE_WATCHING);
        }
        setUserStatus(res.data.userStatus)
      }
    }
    init();
  }, [params.gid])

  return (
    <div>
      <h2>{currentQuestion}</h2>
      {
        gameState === gameStateEnum.OPTION_FILLING && <OptionFilling gid={params.gid} userStatus={userStatus} />
      }
      {
        gameState === gameStateEnum.ANSWER_FILLING && <div>Answer Filling component</div>
      }
      {
        gameState === gameStateEnum.SCORE_WATCHING && <div>Score Watching component</div>
      }
    </div>
  )
}

export default Game;