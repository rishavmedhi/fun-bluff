import { supabase } from "@/utils/supabase/server";

export async function getQuestionsInRandomOrder(limit: number) {
  // using VIEW here - random_questions
  const { data, error } = await supabase
    .from("random_questions")
    .select("id,question")
    .limit(limit);

  if (error) throw error;

  return data;
}

export async function fetchQuestionById(qid: number) {
  const { data, error } = await supabase
    .from("questions")
    .select("question")
    .eq("id", qid);

  if (error) throw error;

  return data;
}
