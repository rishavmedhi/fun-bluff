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
 * @param [publicMode=true] restricts user_id in the response, pass as false if user_id is needed in response
 * @returns
 */
export async function fetchGameUserOptionsByQuesId(
  gameId: number,
  quesId: number,
  publicMode: boolean = true
) {
  const { data, error } = await supabase
    .from("user_options")
    .select("id, user_id, user_option")
    .eq("game_id", gameId)
    .eq("ques_id", quesId);

  if (error) throw error;
  return data;
}

/**
 * fetches the option of a user in a game for a particular question
 * @param userId 
 * @param gameId 
 * @param quesId 
 * @returns 
 */
export async function fetchOptionByUser(
  userId: number,
  gameId: number,
  quesId: number
) {
  const { data, error } = await supabase
    .from("user_options")
    .select("user_id, user_option")
    .eq("game_id", gameId)
    .eq("ques_id", quesId)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}
