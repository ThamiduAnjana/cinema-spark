// Booking Display Layout API Types

export interface DisplayLayoutPayload {
  movie_ref: string;
  layout_id: string;
  date: string;
  time_slot_id: string | null;
}

export interface TimeSlot {
  id: number;
  time: string;
  format: string;
  language: string;
  available: boolean;
  filling_fast?: boolean;
}

export interface CinemaLayout {
  id: string;
  name: string;
  address: string;
  distance?: string;
  formats: {
    name: string;
    showtimes: TimeSlot[];
  }[];
}

export interface MovieDetails {
  id: number;
  ref: string;
  title: string;
  tagline: string | null;
  description: string | null;
  runtime: number | null;
  language: string;
  rating: number | null;
  release_date: string | null;
  genres: string[];
  poster_url: string | null;
  backdrop_url: string | null;
  certificate?: string;
  is_live?: boolean;
}

export interface DisplayLayoutResponse {
  success: boolean;
  data: {
    movie: MovieDetails;
    cinemas: CinemaLayout[];
    available_dates: string[];
  };
  message?: string;
}
