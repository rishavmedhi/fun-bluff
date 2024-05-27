export interface userStatus {
  option_filling?: {
    optionFilled: boolean,
    option?: string|null
  },
  answer_filling?: object,
  score_watching?: {
    readyStatus: boolean
  }
}