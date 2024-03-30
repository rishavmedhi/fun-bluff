import { supabase } from "@/utils/supabase/server";

/**
 * Adds user option to the db
 * @param userOption 
 * @param userId 
 * @param gameId 
 * @param quesId 
 * @returns 
 */
export async function addUserOption(
  userOption: string,
  userId: number,
  gameId: number,
  quesId: number
) {
  const { data, error } = await supabase
    .from("user_options")
    .insert([
      {
        user_id: userId,
        user_option: userOption,
        game_id: gameId,
        ques_id: quesId,
      },
    ])
    .select();
  if (error) throw error;

  return data;
}

/**
 * Fetches all user options of a given question in a given game
 * @param gameId 
 * @param quesId 
 * @returns 
 */
export async function fetchGameUserOptionsByQuesId(gameId: number, quesId: number){
  const { data, error } = await supabase
    .from("user_options")
    .select("user_id, user_option")
    .eq("game_id", gameId)
    .eq("ques_id", quesId)
  
  if (error) throw error;
  return data;
}
