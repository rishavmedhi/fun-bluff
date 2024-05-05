import { fetchGameQuestionsByGameId } from "@/repo/gameQuestionMapping.repo";
import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { fetchQuestionById } from "@/repo/question.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import { fetchOptionByUser } from "@/repo/userOptions.repo";
import { headers } from "next/headers";
import { userStatus } from "../../../../types/api/game/[gid]/responseTypes";
import { catchHandler } from "@/utils/error.utils";

export async function GET(
  request: Request,
  { params }: { params: { gid: number } }
) {
  try {
    const headersList = headers();
    const deviceId = headersList.get("deviceId");

    // return game status
    const gameStatus = await fetchGameStatus(params.gid);
    if (!gameStatus || gameStatus.length === 0 || !deviceId) {
      return Response.json({
        message: "Invalid parameter passed",
        error: true,
      });
    }

    // fetching question of the round
    const gameQuestionMapping = await fetchGameQuestionsByGameId(params.gid);
    // round is decreased by 1 as round is initialised as 1
    const roundQid = gameQuestionMapping[gameStatus[0].round-1];
    const questionData = await fetchQuestionById(roundQid.question_id!);

    // return user state
    // fetch userId from deviceId
    const userData = await findUserByDeviceId(deviceId!);
    if (!userData || userData.length === 0) {
      return Response.json({
        message: "User not found",
        error: true,
      });
    }
    let userStatus : userStatus = {
      option_filling: undefined,
      answer_filling: undefined,
      score_watching: undefined
    };

    if (gameStatus[0].option_filling < 2) {
      // check if user has already entered a option for current round
      const userOption = await fetchOptionByUser(
        userData[0].id,
        params.gid,
        roundQid.question_id!
      );
      if (userOption && userOption.length > 0) {
        userStatus.option_filling = {
          optionFilled: true,
          option: userOption[0].user_option,
        };
      } else {
        userStatus.option_filling = {
          optionFilled: false,
        };
      }
    }
    else if (gameStatus[0].answer_filling < 2) {
      // check if user has attempted an answer for the current round
    }
    else if (gameStatus[0].score_watching < 2) {
      // check if user is ready
    }

    return Response.json({
      message: "Game details fetched successfully",
      data: {
        gameStatus: gameStatus[0],
        questionData: questionData[0],
        userStatus: userStatus,
      },
      error: false,
    });
  } catch (e) {
    return catchHandler(e);
  }
}
