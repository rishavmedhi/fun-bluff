import { User } from "@/types/collection";
import { supabase } from "@/utils/supabase/server";

/**
 * finds a user record by device id
 * @param deviceId
 * @returns {User["Row"][]} array consisting of user record if found | empty array
 */
export async function findUserByDeviceId(deviceId: string) {
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("device_id", deviceId);

  if (error) throw error;

  return data;
}

/**
 * create a new user in the db as per the passed params
 * @param newUser
 * @returns new user created in an array
 */
export async function createNewUser(newUser: User["Insert"]) {
  const { data, error } = await supabase
    .from("user")
    .insert([newUser])
    .select();
  if (error) throw error;

  return data;
}

/**
 * updates the username of the user having the passed device id
 * @param userName new user name
 * @param deviceId device id of the user
 * @returns updated user record
 */
export async function updateUserNamebyDeviceId(
  userName: string,
  deviceId: string
) {
  const { data, error } = await supabase
    .from("user")
    .update({ user_name: userName })
    .eq("device_id", deviceId)
    .select();
  if (error) throw error;

  return data;
}

export async function fetchUsersByUserIds(userIds: number[] | null) {
  const { data, error } = await supabase
    .from("user")
    .select("id,user_name")
    .in("id", userIds);

  if (error) throw error;

  return data;
}
