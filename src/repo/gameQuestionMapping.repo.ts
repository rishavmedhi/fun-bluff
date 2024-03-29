import { supabase } from "@/utils/supabase/server";

interface bulkInsertFormat {
  question_id: number,
  game_id: number
}
export async function bulkInsertGameQuestions(questions : bulkInsertFormat[]){
  const { data, error } = await supabase
    .from("game_question_mapping")
    .insert(questions)
    .select();
  if (error) throw error;

  return data;
}