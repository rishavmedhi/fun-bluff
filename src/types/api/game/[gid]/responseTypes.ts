export interface userStatus {
  option_filling?: {
    optionFilled: boolean,
    option?: string|null
  },
  answer_filling?: {
    answerFilled: boolean,
    answer?: number|null
  },
  score_watching?: {
    readyStatus: boolean
  }
}