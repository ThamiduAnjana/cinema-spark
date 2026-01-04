import { useQuery } from "@tanstack/react-query";
import { fetchDisplayLayout, formatDateForApi } from "@/services/booking-service";
import { DisplayLayoutPayload } from "@/types/booking-api";

interface UseDisplayLayoutOptions {
  movieRef: string;
  layoutId: string;
  date: Date;
  timeSlotId?: string | null;
  enabled?: boolean;
}

export function useDisplayLayout({
  movieRef,
  layoutId,
  date,
  timeSlotId = null,
  enabled = true,
}: UseDisplayLayoutOptions) {
  const formattedDate = formatDateForApi(date);

  const payload: DisplayLayoutPayload = {
    movie_ref: movieRef,
    layout_id: layoutId,
    date: formattedDate,
    time_slot_id: timeSlotId,
  };

  const query = useQuery({
    queryKey: ["displayLayout", movieRef, layoutId, formattedDate, timeSlotId],
    queryFn: () => fetchDisplayLayout(payload),
    enabled: enabled && !!movieRef,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: query.data?.data,
    movie: query.data?.data?.movie,
    cinemas: query.data?.data?.cinemas || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
