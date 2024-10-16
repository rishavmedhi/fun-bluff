import { fetchRoomDetailsByGameId } from "@/repo/game.repo";
import { fetchGameQuestionsByGameId } from "@/repo/gameQuestionMapping.repo";
import { fetchGameStatus, updateGameStatus } from "@/repo/gameStatus.repo";
import { fetchRoomMembersByRoomId } from "@/repo/roomUserMapping.repo";
import { fetchUserAnswersByGameId } from "@/repo/userAnswers.repo";
import { fetchAllGameUsersStatus, fetchReadyGameUsersStatus, updateAllUserReadyStatusbyGameId, updateUserScore } from "@/repo/userGameStatus.repo";
import { fetchGameUserOptionsByQuesId } from "@/repo/userOptions.repo";

interface InAnswerFrequency {
  [key: number]: number
}

interface InOptionToUserIdMapping {
  [key: number]: number
}

interface InUserIdtoFrequency {
  [key: number]: number
}

export async function reviewGameSituation(gameId: number) {
  try {
    // fetch room details from the game
    const gameData = await fetchRoomDetailsByGameId(gameId);
    if(gameData && gameData.length === 0){
      throw new Error("Failed to fetch from game db");
    }

    const roomMemberData = await fetchRoomMembersByRoomId(gameData[0].room_id!);

    // check what is the current state
    const gameStatus = await fetchGameStatus(gameId);
    if (!gameStatus || gameStatus.length === 0) {
      throw new Error("Failed to fetch game status");
    }
    const optionFilling = gameStatus[0].option_filling; // 1st STAGE
    const answerFilling = gameStatus[0].answer_filling; // 2nd STAGE
    const scoreWatching = gameStatus[0].score_watching; // 3rd STAGE
    const round = gameStatus[0].round;

    // fetch question Id of current round
    const allGameQuestions = await fetchGameQuestionsByGameId(gameId);
    const currentRoundQuestionId = allGameQuestions[round - 1].question_id;
    // 1st state = check if all users have gave options
    // if user has gave options and 1st state is 0, make it 1
    // if all users has answered, update 1st state to 2, make 2nd stage as 1
    // return
    if (optionFilling < 2) {
      // fetching all user options for the gameId
      const allUserOptions = await fetchGameUserOptionsByQuesId(
        gameId,
        currentRoundQuestionId!
      );
      // comparing if user options present is same as number of room members
      if (allUserOptions.length === roomMemberData.length) {
        // update game status
        await updateGameStatus(
          { option_filling: 2, answer_filling: 1 },
          gameId
        );
        return;
      } else {
        if (allUserOptions.length > 0 && optionFilling === 0) {
          await updateGameStatus({ option_filling: 1 }, gameId);
        }
        return;
      }
    }
    // 2nd state = check if all users have answered
    // if a user has answered and 2nd state  is 0, make it 1
    // if all users has answered, update 2nd state to 2, make 2nd stage as 1
    // evaluate score
    if (optionFilling === 2 && answerFilling < 2) {
      const userSelectedAnswers = await fetchUserAnswersByGameId(
        gameId,
        currentRoundQuestionId!
      );
      if (
        userSelectedAnswers.length === roomMemberData.length
      ) {
        // update game status
        await updateGameStatus(
          { answer_filling: 2, score_watching: 1 },
          gameId
        );
        // creating user answer occurence mapping
        const answerFrequency:InAnswerFrequency= {};
        userSelectedAnswers.map((userAnswer) => {
          if(answerFrequency[userAnswer.option_id])
            answerFrequency[userAnswer.option_id] = answerFrequency[userAnswer.option_id]+1;
          else
          answerFrequency[userAnswer.option_id] = 1;
        })

        // fetching user options for the question of the game
        const allUserOptions = await fetchGameUserOptionsByQuesId(
          gameId,
          currentRoundQuestionId!
        );
        // create useroption ->  userid mapping
        const optionToUserIdMapping:InOptionToUserIdMapping = {};
        allUserOptions.map((userOption) => {
          optionToUserIdMapping[userOption.id] = userOption.user_id!;
        })

        // create userId -> occurence mapping
        const userIdtoFrequency:InUserIdtoFrequency = {};
        Object.keys(answerFrequency).map(optionKey => {
          const numOptionKey = parseInt(optionKey)
          userIdtoFrequency[optionToUserIdMapping[numOptionKey]] = answerFrequency[numOptionKey]? answerFrequency[numOptionKey]: 0
        })

        // fetching all user status
        const allGameUserStatus = await fetchAllGameUsersStatus(gameId);

        // update user score in user_game_status
        allGameUserStatus.map((userStatus) => {
          // updating if there is an increase in score
          if(userIdtoFrequency[userStatus.user_id]){
            updateUserScore(userStatus.user_id, userStatus.score+userIdtoFrequency[userStatus.user_id],gameId)
          }
        })

        // END answer_filling state, start score_watching state
        await updateGameStatus(
          { answer_filling: 2, score_watching: 1 },
          gameId
        );

        return;
      } else {
        if (userSelectedAnswers.length > 0 && answerFilling === 0) {
          await updateGameStatus({ answer_filling: 1 }, gameId);
        }
        return;
      }
    }

    // 3rd state =  check if all users have marked ready
    // if all marked ready,
    // increase round number,
    // reset all state to 0
    // mark first state as 1,
    // mark all users as not ready
    if (scoreWatching < 2) {
      const readyUsers = await fetchReadyGameUsersStatus(gameId);
      if (readyUsers.length === roomMemberData.length) {
        if (gameStatus[0].round < allGameQuestions.length) {
          await updateGameStatus(
            {
              option_filling: 1,
              answer_filling: 0,
              score_watching: 0,
              round: gameStatus[0].round + 1,
            },
            gameId
          );
          await updateAllUserReadyStatusbyGameId(gameId, false);
          return;
        }
        else{
          // MARK GAME AS COMPLETE
          await updateGameStatus(
            {
              option_filling: 2,
              answer_filling: 2,
              score_watching: 2,
            },
            gameId
          )
          return;
        }
      }
    }
  } catch (error) {
    console.trace(error)
  }
}
