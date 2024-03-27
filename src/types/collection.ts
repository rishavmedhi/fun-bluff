import { Database } from "./supabase"
export type User = Database["public"]["Tables"]["user"];
export type RoomType = Database["public"]["Tables"]["room"];