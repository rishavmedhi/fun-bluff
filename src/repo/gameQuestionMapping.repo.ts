import { supabase } from "@/utils/supabase/server";

interface bulkInsertFormat {
  question_id: number,
  game_id: number
}
export async function bulkInsertGameQuestions(questions : bulkInsertFormat[]){
  const { data, error } = await supabase
    .from("game_question_mapping")
    .insert(questions)
    .select();
  if (error) throw error;

  return data;
}

/**
 * Fetching questions of a game by game ID
 * @param gameId ID of the game
 * @returns ordered list of question ids
 */
export async function fetchGameQuestionsByGameId(gameId: number){
  const {data, error} = await supabase
    .from("game_question_mapping")
    .select("question_id,question_content")
    .eq("game_id", gameId)
  if (error) throw error;

  return data;
}