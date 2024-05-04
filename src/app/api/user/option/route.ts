import { fetchGameQuestionsByGameId } from "@/repo/gameQuestionMapping.repo";
import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { findUserByDeviceId } from "@/repo/user.repo";
import { addUserOption, fetchOptionByUser } from "@/repo/userOptions.repo";
import { reviewGameSituation } from "@/services/backend/game.service";
import { headers } from "next/headers";
export async function POST(request: Request) {
  try {
    const res = await request.json();
    const headersList = headers();
    const deviceId = headersList.get("deviceId");
    if(!res.userOption && !deviceId && !res.gameId){
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

    // return game status
    const gameStatus = await fetchGameStatus(res.gameId);
    
    // if option_filling is not the current state and there is an attempt to save option
    if(gameStatus[0].option_filling===2){
      return Response.json({
        error: true,
        message: "User option not accepted in this game state"
      })
    }
    
    // fetch question details from game question mapping
    const gameQuestionMapping = await fetchGameQuestionsByGameId(res.gameId);
    // round is reduced by 1 since round is initialised from 1
    const roundQid = gameQuestionMapping[gameStatus[0].round-1];

    // check if option is already inserted in db
    const userOption = await fetchOptionByUser(userData[0].id, res.gameId, roundQid.question_id!);
    if(userOption && userOption.length>0){
      return Response.json({
        error: true,
        message: "User option already accepted"
      })
    }
    // save option to db
    await addUserOption(res.userOption, userData[0].id, res.gameId, roundQid.question_id!);
    // send request to game service to review if there are any changes to the status
    reviewGameSituation(res.gameId)

    return Response.json({
      message: "User option saved successfully",
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