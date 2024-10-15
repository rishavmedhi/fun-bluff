"use client"
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { useEffect, useState } from "react";
import { GameStatusType, GameQuestionMappingType } from "@/types/collection";
import OptionFilling from "./components/OptionFilling";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import Loading from "@/components/Loading";
import { supabase } from "@/utils/supabase/server";
import AnswerFilling from "./components/AnswerFilling";
import ScoreWatching from "./components/ScoreWatching";
import CenterContainer from "@/components/CenterContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GameComplete from "./components/GameComplete";

interface gameStatusResponse {
  message: string,
  data: {
    gameStatus: GameStatusType["Row"],
    questionData: {
      question_content: GameQuestionMappingType["Row"]["question_content"]
    },
    userStatus: userStatus
  },
  error: boolean
}

enum gameStateEnum {
  OPTION_FILLING = 0,
  ANSWER_FILLING = 1,
  SCORE_WATCHING = 2,
  GAME_COMPLETE = 3
}

function Game({ params }: { params: { gid: string } }) {
  const [gameStatus, setGameStatus] = useState<GameStatusType["Row"] | undefined>(undefined);
  const [gameState, setGameState] = useState<gameStateEnum>(gameStateEnum.OPTION_FILLING);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userStatus, setUserStatus] = useState<userStatus>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refetchGameData, setRefetchGameData] = useState<boolean>(false)

  useEffect(() => {
    async function init() {
      setLoading(true);
      const res: gameStatusResponse = await clientApiFetch("/api/game/" + params.gid, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        const resGameStatus = res.data.gameStatus;
        setCurrentQuestion(res.data.questionData.question_content!);
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
        else if(resGameStatus.option_filling === 2 && resGameStatus.answer_filling === 2 && resGameStatus.score_watching === 2){
          setGameState(gameStateEnum.GAME_COMPLETE);
        }
        setUserStatus(res.data.userStatus)
      }
      setLoading(false);
    }
    if(!gameStatus)
      init();

    if(gameStatus && refetchGameData){
      init();
      setRefetchGameData(false);
    }
    
    const channel = supabase.channel("realtime game_status changes").on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'game_status', filter: 'game_id=eq.'+params.gid
    }, async (payload) => {
      console.log("game_status subscription", payload)
      if (payload.new && payload.new.game_id === parseInt(params.gid)) {
        setGameStatus(payload.new as GameStatusType["Row"]);
        if (payload.new.option_filling < 2) {
          setGameState(gameStateEnum.OPTION_FILLING);
          setRefetchGameData(true)
        }
        else if (payload.new.answer_filling < 2) {
          setGameState(gameStateEnum.ANSWER_FILLING);
        }
        else if (payload.new.score_watching < 2) {
          setGameState(gameStateEnum.SCORE_WATCHING);
        }
        else if(payload.new.option_filling === 2 && payload.new.answer_filling === 2 && payload.new.score_watching === 2){
          setGameState(gameStateEnum.GAME_COMPLETE);
        }
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel)
    }

  }, [params.gid, gameStatus, refetchGameData])

  return (
    <CenterContainer>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader />
        <CardContent>
          {
            gameState !== gameStateEnum.GAME_COMPLETE && <div className="text-xl mb-2">{currentQuestion}</div>
          }

          {
            gameState === gameStateEnum.OPTION_FILLING && <OptionFilling gid={parseInt(params.gid)} userStatus={userStatus} />
          }
          {
            gameState === gameStateEnum.ANSWER_FILLING && <AnswerFilling gid={parseInt(params.gid)}  userStatus={userStatus}/>
          }
          {
            gameState === gameStateEnum.SCORE_WATCHING && <ScoreWatching gid={parseInt(params.gid)} userStatus={userStatus}/>
          }
          {
            gameState === gameStateEnum.GAME_COMPLETE && <GameComplete gid={parseInt(params.gid)} userStatus={userStatus}/>
          }
        </CardContent>
      </Card>
      {
        loading && <Loading />
      }
    </CenterContainer>
  )
}

export default Game;