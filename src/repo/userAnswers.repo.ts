import { UserAnswerType } from "@/types/collection";
import { supabase } from "@/utils/supabase/server";

/**
 * Fetch user answers of a question in a game
 * @param gameId
 * @param questionId
 * @returns
 */
export async function fetchUserAnswersByGameId(
  gameId: number,
  questionId: number
) {
  const { data, error } = await supabase
    .from("user_answers")
    .select()
    .eq("game_id", gameId)
    .eq("question_id", questionId);

  if (error) throw error;
  return data;
}

/**
 * Add a user answer for a question in a game
 * @param gameId 
 * @param userId 
 * @param questionId 
 * @param optionId 
 * @returns 
 */
export async function addUserAnswer(
  gameId: number,
  userId: number,
  questionId: number,
  optionId: number
) {
  const { data, error } = await supabase
    .from("user_answers")
    .insert([
      {
        game_id: gameId,
        user_id: userId,
        question_id: questionId,
        option_id: optionId,
      },
    ])
    .select();

  if (error) throw error;
  return data;
}
