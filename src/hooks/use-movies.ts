import { useQuery } from "@tanstack/react-query";
import { fetchMovies, transformApiMovie, TransformedMovie } from "@/services/movie-service";
import { MovieType } from "@/types/api";

interface UseMoviesOptions {
  type: MovieType;
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

interface UseMoviesResult {
  movies: TransformedMovie[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
  refetch: () => void;
}

export function useMovies({
  type,
  page = 1,
  perPage = 10,
  enabled = true,
}: UseMoviesOptions): UseMoviesResult {
  const query = useQuery({
    queryKey: ["movies", type, page, perPage],
    queryFn: () => fetchMovies({ type, page, perPage }),
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in garbage collection for 10 minutes
  });

  const movies = query.data?.data?.data?.map((movie) => transformApiMovie(movie, type)) || [];
  const paginationData = query.data?.data;

  return {
    movies,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    pagination: {
      currentPage: paginationData?.current_page || 1,
      lastPage: paginationData?.last_page || 1,
      total: paginationData?.total || 0,
      perPage: paginationData?.per_page || perPage,
    },
    refetch: query.refetch,
  };
}

// Hook specifically for Now Showing movies
export function useNowShowingMovies(page = 1, perPage = 12) {
  return useMovies({ type: "now_showing", page, perPage });
}

// Hook specifically for Upcoming movies
export function useUpcomingMovies(page = 1, perPage = 10) {
  return useMovies({ type: "upcoming", page, perPage });
}
