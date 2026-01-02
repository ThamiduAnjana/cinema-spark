import { useQuery } from "@tanstack/react-query";
import { fetchBookingMovies, transformApiMovieWithShowtimes, TransformedMovieWithShowtimes } from "@/services/movie-service";

export function useBookingMovies() {
  return useQuery({
    queryKey: ["booking-movies"],
    queryFn: async () => {
      const response = await fetchBookingMovies();
      return response.data.map((movie) => transformApiMovieWithShowtimes(movie));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useMovieByRef(movieRef: string) {
  const { data: movies, isLoading, error } = useBookingMovies();
  
  const movie = movies?.find(
    (m) => m.ref === movieRef || m.id === movieRef
  );
  
  return {
    movie,
    allMovies: movies,
    isLoading,
    error,
  };
}
