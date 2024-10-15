import { supabase } from "@/utils/supabase/server";

interface allUsersPayloadType {
  user_id: number;
  game_id: number;
}

export async function createAllUsersGameStatus(
  allUsersPayload: allUsersPayloadType[]
) {
  const { data, error } = await supabase
    .from("user_game_status")
    .insert(allUsersPayload)
    .select();
  if (error) throw error;

  return data;
}

/**
 * fetch user status of users who are ready for a gameId
 * @param gameId game ID
 * @returns 
 */
export async function fetchReadyGameUsersStatus(gameId: number){
  const { data, error } = await supabase
    .from("user_game_status")
    .select("user_id,ready_status,score")
    .eq("game_id", gameId)
    .eq("ready_status", true)

  if (error) throw error;

  return data;
}

/**
 * fetch user status of all users in a game
 * @param gameId game ID
 * @returns 
 */
export async function fetchAllGameUsersStatus(gameId: number){
  const { data, error } = await supabase
    .from("user_game_status")
    .select("user_id,ready_status,score")
    .eq("game_id", gameId)

  if (error) throw error;

  return data;
}

/**
 * Update user ready status for a game
 * @param readyStatus new ready status
 * @param gameId gameId for which user ready status is to be updated
 * @param userId userId whose game user status is to be updated
 * @returns 
 */
export async function updateGameUserReadyStatus(readyStatus: boolean, gameId: number, userId: number){
  const { data, error } = await supabase
    .from("user_game_status")
    .update({ready_status: readyStatus})
    .eq("game_id", gameId)
    .eq("user_id", userId)

  if (error) throw error;

  return data;
}

/**
 * Fetching the game status of a particular user in a particular game
 * @param gameId 
 * @param userId 
 * @returns 
 */
export async function fetchUserGameStatusbyUserIdGameId(gameId: number, userId: number){
  const { data, error } = await supabase
    .from("user_game_status")
    .select()
    .eq("game_id", gameId)
    .eq("user_id", userId)

  if (error) throw error;

  return data;
}

/**
 * Update the score of the user
 * @param userId 
 * @param score 
 * @param gameId 
 * @returns 
 */
export async function updateUserScore(userId: number, score: number, gameId: number){
  const { data, error } = await supabase
    .from("user_game_status")
    .update({score: score})
    .eq("game_id", gameId)
    .eq("user_id", userId)

  if (error) throw error;

  return data;
}

/**
 * Fetching user score and user name of all users in a game
 * UserId is not projected
 * @param gameId 
 * @returns 
 */
export async function fetchUserNameScore(gameId: number){
  const {data, error} = await supabase
    .from("user_game_status")
    .select("score, user(user_name)")
    .eq("game_id", gameId)
    .order("score", { ascending: false })
  
  if (error) throw error;

  return data;
}

export async function updateAllUserReadyStatusbyGameId(gameId: number, targetStatus: boolean){
  const {data, error} = await supabase
    .from("user_game_status")
    .update({ready_status: targetStatus})
    .eq("game_id", gameId)
  
  if (error) throw error;

  return data;
}