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

export async function fetchRoomDetailsByGameId(gameId: number){
  const { data, error } = await supabase
    .from("game")
    .select("id, room_id, room_user_mapping(user_id)")
    .eq("id", gameId)
  if (error) throw error;

  return data;
}