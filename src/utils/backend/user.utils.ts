
export function randomRoomMemberName(roomMembers : {id: number, user_name: string}[]){
  return roomMembers[Math.floor(Math.random() * roomMembers.length)].user_name;
}