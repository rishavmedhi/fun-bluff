import { RoomCodes } from "@/constants/room.constants";

/**
 * fetches a random room code 
 * @returns {String} room code
 */
export function fetchRoomCode(): string{
  const rndInd = getRandomIntInclusive(0,99);
  return RoomCodes[rndInd];
}

function getRandomIntInclusive(min : number, max : number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}