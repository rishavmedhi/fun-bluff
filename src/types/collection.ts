import { Database } from "./supabase"
export type User = Database["public"]["Tables"]["user"];
export type RoomType = Database["public"]["Tables"]["room"];
export type GameStatusType = Database["public"]["Tables"]["game_status"]
export type UserAnswerType = Database["public"]["Tables"]["user_answers"]
export type QuestionType = Database["public"]["Tables"]["questions"]
export type GameQuestionMappingType = Database["public"]["Tables"]["game_question_mapping"]