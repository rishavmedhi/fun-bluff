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
