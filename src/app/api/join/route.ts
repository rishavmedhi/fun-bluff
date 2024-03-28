import { findRoomMembersByRoomCode } from "@/repo/room.repo";
import { insertNewRoomMember } from "@/repo/roomUserMapping.repo";
import {
  createNewUser,
  fetchUsersByUserIds,
  findUserByDeviceId,
  updateUserNamebyDeviceId,
} from "@/repo/user.repo";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    if (!res.user_name || !res.device_id || !res.room_code)
      return Response.json({
        message: "Missing required params",
        error: true,
      });
    // find existing user by device id
    // check if user name is same
    // if not -> proceed to update the user name
    // if not found, create new user
    // find room by room code -> add user to the room code and return room id

    // finding the user by deviceId
    let userData;
    userData = await findUserByDeviceId(res.device_id);
    if (userData && userData.length > 0) {
      if (userData[0].user_name !== res.user_name) {
        // updating the user name of the user
        userData = await updateUserNamebyDeviceId(res.user_name, res.device_id);
      }
    } else {
      // creating new user
      const newUser = { user_name: res.user_name, device_id: res.device_id };
      userData = await createNewUser(newUser);
    }

    // search room by room code and fetch room members
    let roomDetails = await findRoomMembersByRoomCode(res.room_code);
    if (!roomDetails || (roomDetails && roomDetails.length === 0)) {
      return Response.json({
        message: "Room not found, Room code incorrect",
        error: true,
      });
    }

    let roomMembers = roomDetails[0].room_user_mapping;
    let userFound = false;
    // check if joining user is already a member of the room
    for (let i = 0; i < roomMembers.length; i++) {
      if (roomMembers[i].user_id === userData[0].id) {
        userFound = true;
        break;
      }
    }
    // if user not a room memeber
    if (!userFound) {
      // insert user to room
      await insertNewRoomMember(roomDetails[0].id, userData[0].id);
      // refetch the room members
      roomDetails = await findRoomMembersByRoomCode(res.room_code);
    }

    // fetch user details
    roomMembers = roomDetails[0].room_user_mapping;
    const userIds = roomMembers.map((member) => member.user_id);
    const memberDetails = await fetchUsersByUserIds(userIds);

    return Response.json({
      message: "Room joined successfully",
      data: {
        user: userData,
        roomDetails: roomDetails,
        memberDetails: memberDetails,
      },
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
