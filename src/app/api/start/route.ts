import { fetchRoomCode } from "@/utils/room.utils";
import { supabase } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    if (!res.user_name || !res.device_id)
      return Response.json({
        message: "Missing required params",
        error: true,
      });

    let userData;
    // search by deviceId
    const { data: existingUserData, error: ExistUserError } = await supabase
      .from("user")
      .select()
      .eq("device_id", res.device_id);

    if (existingUserData && existingUserData.length > 0) {
      // updating new user name
      if (existingUserData[0].user_name !== res.user_name) {
        const { data: updateUserData, error: updateUserError } = await supabase
          .from("user")
          .update({ user_name: res.user_name })
          .eq("device_id", res.device_id)
          .select();
        userData = updateUserData;

        if (updateUserError) {
          throw updateUserData;
        }
      } else userData = existingUserData;
    } else {
      // adding new user
      const newUser = { user_name: res.user_name, device_id: res.device_id };
      const { data: newUserData, error: newUserError } = await supabase
        .from("user")
        .insert([newUser])
        .select();

      userData = newUserData;

      if (newUserError) {
        throw newUserError;
      }
    }

    const { data: roomData, error: roomError } = await supabase
      .from("room")
      .insert([{ room_code: fetchRoomCode() }])
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
      data: { user: userData, room: roomData, memberDetails: userData },
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
