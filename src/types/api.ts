// API Response Types

export interface MediaFile {
  id: number;
  url: string;
  type?: string;
  alt?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country?: string;
}

export interface ApiMovie {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  runtime: number | null;
  language: string;
  rating: number | null;
  release_date: string | null;
  genres: string[];
  poster_media: MediaFile | null;
  backdrop_media: MediaFile | null;
  gallery_medias: MediaFile[];
  cast_details: CastMember[];
  crew_details?: CrewMember[];
  production_companies?: ProductionCompany[];
  trailer_url: string | null;
  type?: MovieType;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MoviesApiResponse {
  success: boolean;
  data: {
    data: ApiMovie[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message?: string;
}

export type MovieType = "now_showing" | "upcoming";
