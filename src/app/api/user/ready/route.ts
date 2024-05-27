import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import { updateGameUserReadyStatus } from "@/repo/userGameStatus.repo";
import { reviewGameSituation } from "@/services/backend/game.service";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const headersList = headers();
    const deviceId = headersList.get("deviceId");
    if(!deviceId && !res.gameId){
      return Response.json({
        message: "Missing required params",
        error: true,
      });
    }

    // fetch userId from deviceId
    const userData = await findUserByDeviceId(deviceId!);
    if(!userData || userData.length===0){
      return Response.json({
        message: "User not found",
        error: true,
      }); 
    }

    // check game status if it is on score_watching
    const gameStatus = await fetchGameStatus(res.gameId);
    if (!gameStatus || gameStatus.length === 0) {
      return Response.json({
        message: "Game data cannot be found",
        error: true,
      });
    }

    if (gameStatus[0].answer_filling < 2) {
      return Response.json({
        message: "User cannot be marked as ready in this game state",
        error: true,
      });
    }

    // update user game ready status
    await updateGameUserReadyStatus(true, res.gameId, userData[0].id);
    // trigger game status review
    reviewGameSituation(res.gameId)

    return Response.json({
      message: "User is now marked ready",
      error: false,
    })

  }
  catch(e){
    console.log(e);
    return Response.json({
      message: "Something went wrong! Please try again later",
      error: true,
    });
  }
}