export type MatchRoomStatus =
  | "waiting"
  | "active"
  | "completed"
  | "cancelled";

export interface MatchRoom {
  id: string;
  target_language: string;
  status: MatchRoomStatus;
  user_one_id: string | null;
  user_two_id: string | null;
  daily_room_url: string | null;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
}