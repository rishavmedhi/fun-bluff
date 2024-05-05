import { fetchGameQuestionsByGameId } from "@/repo/gameQuestionMapping.repo";
import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import { fetchUserGameStatusbyUserIdGameId } from "@/repo/userGameStatus.repo";
import { fetchGameUserOptionsByQuesId } from "@/repo/userOptions.repo";
import { catchHandler } from "@/utils/error.utils";
import { headers } from "next/headers";

export async function GET(request: Request, { params }: { params: { gid: number } }) {
  try {
    // check if a valid user - part of the game is fetching the options
    const headersList = headers();
    const deviceId = headersList.get("deviceId");

    const userData = await findUserByDeviceId(deviceId!);
    if (!userData || userData.length === 0) {
      return Response.json({
        message: "User not found",
        error: true,
      });
    }

    const userGameStatus = await fetchUserGameStatusbyUserIdGameId(
      params.gid,
      userData[0].id
    );
    if (!userGameStatus || userGameStatus.length === 0) {
      return Response.json({
        message: "Missing game status of the user",
        error: true,
      });
    }

    // check game status if it is answer filling
    const gameStatus = await fetchGameStatus(params.gid);
    if (!gameStatus || gameStatus.length === 0) {
      return Response.json({
        message: "Game data cannot be found",
        error: true,
      });
    }
    if (gameStatus[0].option_filling < 2) {
      return Response.json({
        message: "Options cannot be fetched at this game state",
        error: true,
      });
    }
    // fetch the options of the current round
    // fetching question details
    const gameQuestionMapping = await fetchGameQuestionsByGameId(params.gid);
    // round is decreased by 1 as round is initialised as 1
    const roundQid = gameQuestionMapping[gameStatus[0].round - 1];
    console.log(params.gid, roundQid.question_id!);
    const roundOptions = await fetchGameUserOptionsByQuesId(
      params.gid,
      roundQid.question_id!
    );

    // return the options
    return Response.json({
      message: "Round Options fetched successfully",
      data: {
        options: roundOptions,
      },
      error: false,
    });
  } catch (e) {
    return catchHandler(e);
  }
}
