/**
 * Fetches the deviceId stored in localstorage
 * If it does exist in localstorage, creates a new deviceId, stores in localstorage and returns it
 * @returns {string} deviceId
 */
export function fetchUserDeviceId(): string{
  if(localStorage.getItem("deviceId")){
    return localStorage.getItem("deviceId")!;
  }
  else{
    // generating new deviceId
    const deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
    return deviceId
  }
}

export function updateLocalUsername(userName: string){
  if(localStorage?.getItem("username") === userName ){
    return localStorage.getItem("username");
  }
  else{
    // storing new username
    localStorage.setItem("username", userName);
  }
}