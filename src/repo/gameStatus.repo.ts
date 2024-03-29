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
