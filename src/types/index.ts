export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  session_id: string;
}

export interface MovieDetailsResponse extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface AuthResponse {
  success: boolean;
  session_id: string;
  request_token?: string;
}

export interface WatchlistResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieAccountStates {
  id: number;
  favorite: boolean;
  watchlist: boolean;
  rated?: {
    value: number;
  };
}

export interface MovieDetailsResponse extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface AuthResponse {
  success: boolean;
  session_id: string;
  request_token?: string;
}

export interface WatchlistResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}