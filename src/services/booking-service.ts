import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api-config";
import { DisplayLayoutPayload, DisplayLayoutResponse } from "@/types/booking-api";

export async function fetchDisplayLayout(
  payload: DisplayLayoutPayload
): Promise<DisplayLayoutResponse> {
  const response = await fetch(API_ENDPOINTS.bookingDisplayLayout, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch display layout: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper to format date as YYYY-MM-DD
export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}
