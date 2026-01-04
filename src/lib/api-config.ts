// Central API Configuration
// Change this BASE_API_URL to switch between environments (local/staging/production)
export const BASE_API_URL = "http://127.0.0.1:8000/api";

// Bearer Token for API Authorization
export const API_AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3Njc1MTk1MDUsImV4cCI6MTc2NzU1NTUwNSwibmJmIjoxNzY3NTE5NTA1LCJqdGkiOiJGdUczeWlEVGdsVTVla1NPIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJpbmR1c3RyeV9pZCI6NywiaW5kdXN0cnlfbmFtZSI6IlJlc3RhdXJhbnRzIiwiZG9tYWluIjoiZmxleGlfcG9zIn0.N0FHye1E94dWCVIxNqbcl0_hkeowrQi5iwWk9PtoO_k";

// API Endpoints - all built from BASE_API_URL
export const API_ENDPOINTS = {
  movies: `${BASE_API_URL}/theater-ticketing/movies`,
  bookingDisplayLayout: `${BASE_API_URL}/theater-ticketing/booking/display-layout`,
} as const;

// Helper to get authorization headers
export function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_AUTH_TOKEN}`,
  };
}

// TMDB Image base URL for cast profile images
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
