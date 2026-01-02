// Central API Configuration
// Change this BASE_API_URL to switch between environments (local/staging/production)
export const BASE_API_URL = "http://127.0.0.1:8000/api";

// API Endpoints - all built from BASE_API_URL
export const API_ENDPOINTS = {
  movies: `${BASE_API_URL}/theater-ticketing/movies`,
} as const;

// TMDB Image base URL for cast profile images
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
