import { supabase } from "@/utils/supabase/server";

export async function insertNewRoomMember(roomId: number, userId: number) {
  const { data, error } = await supabase
    .from("room_user_mapping")
    .insert([{ room_id: roomId, user_id: userId }])
    .select();
  if (error) throw error;

  return data;
}

/**
 * Fetch the members of the given room Id
 * @param roomId Room Id
 * @returns 
 */
export async function fetchRoomMembersByRoomId(roomId: number){
  const { data, error } = await supabase
    .from("room_user_mapping")
    .select('user_id')
    .eq('room_id', roomId)

  if (error) throw error;

  return data;
}