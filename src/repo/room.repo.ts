import { supabase } from "@/utils/supabase/server";

export async function findRoomMembersByRoomCode(roomCode: string){
  const { data, error } = await supabase
    .from("room")
    .select('id, room_code, room_user_mapping(user_id)')
    .eq("room_code", roomCode);

  if (error) throw error;

  return data;
}