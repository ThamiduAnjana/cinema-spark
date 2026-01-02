import { API_ENDPOINTS } from "@/lib/api-config";
import { MoviesApiResponse, MovieType, ApiMovie, BookingMoviesApiResponse, ApiMovieWithShowtimes } from "@/types/api";

interface FetchMoviesParams {
  page?: number;
  perPage?: number;
  type: MovieType;
}

export async function fetchMovies({
  page = 1,
  perPage = 10,
  type,
}: FetchMoviesParams): Promise<MoviesApiResponse> {
  const url = new URL(API_ENDPOINTS.movies);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("type", type);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchBookingMovies(): Promise<BookingMoviesApiResponse> {
  const response = await fetch(API_ENDPOINTS.bookingMovies);

  if (!response.ok) {
    throw new Error(`Failed to fetch booking movies: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper to format runtime from minutes to "Xh Ym" format
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// Transform API movie to component-friendly format
export function transformApiMovie(movie: ApiMovie, movieType?: MovieType) {
  return {
    id: String(movie.id),
    ref: movie.movie_ref,
    title: movie.title,
    tagline: movie.tagline,
    description: movie.description || "",
    runtime: formatRuntime(movie.runtime),
    runtimeMinutes: movie.runtime,
    language: movie.language,
    rating: movie.rating || 0,
    releaseDate: movie.release_date || "",
    genres: movie.genres || [],
    poster: movie.poster_media?.url || "",
    backdrop: movie.backdrop_media?.url || "",
    galleryImages: movie.gallery_medias?.map((m) => m.url) || [],
    cast: movie.cast_details || [],
    crew: movie.crew_details || [],
    productionCompanies: movie.production_companies || [],
    trailerUrl: movie.trailer_url,
    movieType: movie.type || movieType || "now_showing",
  };
}

export type TransformedMovie = ReturnType<typeof transformApiMovie>;

// Transform API movie with showtimes for booking page
export function transformApiMovieWithShowtimes(movie: ApiMovieWithShowtimes) {
  return {
    id: String(movie.id),
    ref: movie.movie_ref,
    title: movie.title,
    tagline: movie.tagline,
    description: movie.description || "",
    runtime: formatRuntime(movie.runtime),
    runtimeMinutes: movie.runtime,
    language: movie.language,
    rating: movie.rating || 0,
    releaseDate: movie.release_date || "",
    genres: movie.genres || [],
    poster: movie.poster_media?.url || "",
    backdrop: movie.backdrop_media?.url || "",
    galleryImages: movie.gallery_medias?.map((m) => m.url) || [],
    cast: movie.cast_details || [],
    crew: movie.crew_details || [],
    productionCompanies: movie.production_companies || [],
    trailerUrl: movie.trailer_url,
    movieType: movie.type || "now_showing",
    theaters: movie.theaters || [],
  };
}

export type TransformedMovieWithShowtimes = ReturnType<typeof transformApiMovieWithShowtimes>;
