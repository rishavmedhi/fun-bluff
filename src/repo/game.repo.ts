import { supabase } from "@/utils/supabase/server";

/**
 * Creates a new record in the game db
 * @param roomId room ID
 * @returns 
 */
export async function createGame(roomId: number) {
  const { data, error } = await supabase
    .from("game")
    .insert([{room_id: roomId}])
    .select();
  if (error) throw error;

  return data;
}