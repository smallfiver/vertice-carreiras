import { createClient } from "@/lib/supabase/server";

export type EventType =
  | "login"
  | "view_dashboard"
  | "view_training"
  | "view_lesson"
  | "complete_lesson"
  | "view_jobs"
  | "view_job"
  | "apply_job"
  | "view_profile"
  | "support_message";

export async function trackEvent(
  userId: string,
  eventType: EventType,
  eventData: Record<string, unknown> = {}
) {
  try {
    const supabase = createClient();
    await supabase.from("user_events").insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
    });
  } catch {
    // silencioso — tracking nunca deve quebrar a UX
  }
}
