import { createGame } from "@/repo/game.repo";
import { bulkInsertGameQuestions } from "@/repo/gameQuestionMapping.repo";
import { createGameStatus } from "@/repo/gameStatus.repo";
import { getQuestionsInRandomOrder } from "@/repo/question.repo";
import { fetchRoomMembersByRoomId } from "@/repo/roomUserMapping.repo";
import { createAllUsersGameStatus } from "@/repo/userGameStatus.repo";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    if(!res.roomId){
      return Response.json({
        message: "Missing required params",
        error: true,
      });
    }

    // TODO:: check if requester is the creator


    // create a game in db
    const game = await createGame(res.roomId);
    // create a game_status entry in db
    const game_status = await createGameStatus(game[0].id);
    // add questions to the game_question_mapping
      // fetch questions
      // randomise the order of questions
      // add questions to game_question_mapping
    const questions = await getQuestionsInRandomOrder(3)
    // parsing questions to insertion format
    const insertQuestionsPayload = questions.map((question) => ({question_id: question.id!, game_id: game[0].id}));
    await bulkInsertGameQuestions(insertQuestionsPayload);
    // add entries to the user_game_status
    const roomMembers = await fetchRoomMembersByRoomId(res.roomId);
    const insertUserGameStatusPayload = roomMembers.map((member) => ({game_id: game[0].id, user_id: member.user_id}));
    await createAllUsersGameStatus(insertUserGameStatusPayload);
    // return the gameId 
    return Response.json({
      message: "Game created successfully",
      data: { gameId: game[0].id },
      error: false,
    });
  }
  catch(e){
    console.log(e);
    return Response.json({
      message: "Something went wrong! Please try again later",
      error: true,
    });
  }
}