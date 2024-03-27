import { supabase } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try{
  const id = params.id;

  const { data, error } = await supabase
      .from("user")
      .select("user_name,id")
      .eq("id", parseInt(id))
  
  if(error){
    throw(error)
  }

  if(data && data.length>0){
    return Response.json({
      message: "User details retrieved",
      data: data[0],
      error: false,
    })
  }
  else
    return Response.json({
      message: "User not found",
      error: true,
    })
  }
  catch(e){
    console.error("User Details Fetch Error", e)
    return Response.json({
      message: "Something went wrong! Please try again later",
      error: true,
    })
  }
}