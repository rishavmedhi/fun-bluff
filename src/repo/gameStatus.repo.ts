import { GameStatusType } from "@/types/collection";
import { supabase } from "@/utils/supabase/server";

/**
 * creates a new record in the game_status db
 * @param gameId 
 * @returns 
 */
export async function createGameStatus(gameId: number) {
  const { data, error } = await supabase
    .from("game_status")
    .insert([{ game_id: gameId }])
    .select();
  if (error) throw error;

  return data;
}

/**
 * Fetches game status db record with respect to passed gameId
 * @param gameId game ID
 * @returns 
 */
export async function fetchGameStatus(gameId: number){
  const { data, error } = await supabase
    .from("game_status")
    .select()
    .eq("game_id", gameId)
  if (error) throw error;

  return data;
}

/**
 * update gameStatus as per given payload for a given gameId
 * @param updatePayload update payload of GameStatusType
 * @param gameId id of the game whose status is to be updated
 * @returns updated game status record
 */
export async function updateGameStatus(updatePayload: GameStatusType["Update"], gameId: number){
  const { data, error } = await supabase
    .from("game_status")
    .update(updatePayload)
    .eq("game_id", gameId)
    .select()
  if (error) throw error;

  return data;
}