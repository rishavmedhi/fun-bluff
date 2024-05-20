import { fetchGameQuestionsByGameId } from "@/repo/gameQuestionMapping.repo";
import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import { addUserAnswer } from "@/repo/userAnswers.repo";
import { fetchUserGameStatusbyUserIdGameId } from "@/repo/userGameStatus.repo";
import { reviewGameSituation } from "@/services/backend/game.service";
import { catchHandler } from "@/utils/error.utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const res = await request.json();
    const headersList = headers();
    const deviceId = headersList.get("deviceId");
    if (!res.optionId && !deviceId && !res.gameId) {
      return Response.json({
        message: "Missing required params",
        error: true,
      });
    }

    // fetch userId from deviceId
    const userData = await findUserByDeviceId(deviceId!);
    if (!userData || userData.length === 0) {
      return Response.json({
        message: "User not found",
        error: true,
      });
    }

    // check if user is part of game
    const userGameStatus = await fetchUserGameStatusbyUserIdGameId(
      res.gameId,
      userData[0].id
    );
    if (!userGameStatus || userGameStatus.length === 0) {
      return Response.json({
        message: "Missing game status of the user",
        error: true,
      });
    }

    // return game status
    const gameStatus = await fetchGameStatus(res.gameId);

    // if answer_filling is not the current state and there is an attempt to save user option
    if (
      gameStatus[0].option_filling !== 2 &&
      gameStatus[0].answer_filling === 2
    ) {
      return Response.json({
        error: true,
        message: "User answer is not accepted in this game state",
      });
    }

    // fetch question details from game question mapping
    const gameQuestionMapping = await fetchGameQuestionsByGameId(res.gameId);
    // round is reduced by 1 since round is initialised from 1
    const roundQid = gameQuestionMapping[gameStatus[0].round - 1];

    // save option to db
    try {
      await addUserAnswer(
        res.gameId,
        userData[0].id,
        roundQid.question_id!,
        res.optionId
      );
      // send request to game service to review if there are any changes to the status
      reviewGameSituation(res.gameId);
    } catch (e: any) {
      if (e.code === "23505") {
        return NextResponse.json(
          {
            message: "User has already answered for this question",
            error: true,
          },
          {
            status: 409,
          }
        );
      }
      else{
        return catchHandler(e);
      }
    }

    return Response.json({
      message: "User answer saved successfully",
      error: false,
    });
  } catch (e) {
    return catchHandler(e);
  }
}
