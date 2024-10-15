export interface InScoreAPIResponse {
  message: string,
  error: boolean,
  data: InResponseData
}

export interface InResponseData {
  score: InUserScore[],
}

export interface InUserScore {
  score: number,
  user: InUser
}

interface InUser {
  user_name: string
}