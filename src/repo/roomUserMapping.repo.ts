import { supabase } from "@/utils/supabase/server";

export async function insertNewRoomMember(roomId: number, userId: number) {
  const { data, error } = await supabase
    .from("room_user_mapping")
    .insert([{ room_id: roomId, user_id: userId }])
    .select();
  if (error) throw error;

  return data;
}
