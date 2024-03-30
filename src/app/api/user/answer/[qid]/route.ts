import { findUserByDeviceId } from "@/repo/user.repo";
import { addUserAnswer } from "@/repo/userAnswers.repo";
import { reviewGameSituation } from "@/services/backend/game.service";
import { headers } from "next/headers";
export async function POST(
  request: Request,
  { params }: { params: { qid: number } }
) {
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
    // save option to db
    const userOption = await addUserAnswer(
      res.gameId,
      userData[0].id,
      params.qid,
      res.optionId
    );
    // send request to game service to review if there are any changes to the status
    reviewGameSituation(res.gameId);

    return Response.json({
      message: "User answer saved successfully",
      error: false,
    });
  } catch (e) {
    console.log(e);
    return Response.json({
      message: "Something went wrong! Please try again later",
      error: true,
    });
  }
}
