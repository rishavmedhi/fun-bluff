import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import {
  fetchAllGameUsersStatus,
  fetchUserGameStatusbyUserIdGameId,
  fetchUserNameScore,
} from "@/repo/userGameStatus.repo";
import { catchHandler } from "@/utils/error.utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { gid: number } }
) {
  try {
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

    if (gameStatus[0].answer_filling < 2) {
      return Response.json({
        message: "Scores cannot be fetched at this game state",
        error: true,
      });
    }

    const allGameUserStatusData = await fetchUserNameScore(params.gid);
    if (!allGameUserStatusData || allGameUserStatusData.length === 0) {
      return NextResponse.json(
        {
          message: "Failed to fetch game scores! Please try again later",
          error: true,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      message: "Round score fetched successfully",
      data: {
        score: allGameUserStatusData,
      },
      error: false,
    });
  } catch (e) {
    return catchHandler(e);
  }
}
