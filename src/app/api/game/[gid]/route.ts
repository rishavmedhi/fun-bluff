import { fetchGameStatus } from "@/repo/gameStatus.repo";
import { headers } from "next/headers";
export async function GET(
  request: Request,
  { params }: { params: { gid: number } }
) {
  try {
    const headersList = headers();
    const referer = headersList.get("deviceId");

    // return game status
    const gameStatus = await fetchGameStatus(params.gid);
    return Response.json({
      message: "Game details fetched successfully",
      data: { gameStatus: gameStatus[0] },
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
