import { supabase } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    if (!res.user_name || !res.device_id)
      return Response.json({
        message: "Missing required params",
        error: true,
      });

    const newUser = { user_name: res.user_name, device_id: res.device_id };
    const { data: userData, error: userError } = await supabase
      .from("user")
      .insert([newUser])
      .select();

    if (userError) {
      throw userError;
    }

    const { data: roomData, error: roomError } = await supabase
      .from("room")
      .insert([{ room_code: "SUPAMAN" }])
      .select();

    if (roomError) {
      throw roomError;
    }

    const { data: roomMapping, error: roomMappingError } = await supabase
      .from("room_user_mapping")
      .insert([{ room_id: roomData![0]!.id, user_id: userData![0]!.id }])
      .select();

    return Response.json({
      message: "Room created successfully",
      data: { user: userData, room: roomData },
      error: false,
    });
  } catch (e) {
    console.log(e);
    return Response.json({
      message: "Something went wrong! Please try again later",
      error: true,
    });
  }
}
