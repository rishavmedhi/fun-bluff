/**
 * code block for catch in try-catch wrapper of backend code.
 * @param error 
 * @returns 
 */
export function catchHandler(error: any){
  console.log(error);
  return Response.json({
    message: "Something went wrong! Please try again later",
    error: true,
  });
}