import { fetchDataV3 } from './api';
import { type MovieAccountStates, type MovieDetailsResponse, type MovieResponse, type WatchlistResponse,  } from '../types';

// Get now playing movies
export const getNowPlayingMovies = async (page = 1): Promise<MovieResponse> => {
  return fetchDataV3(`/movie/now_playing`, {
    params: { page }
  });
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  return fetchDataV3(`/movie/top_rated`, {
    params: { page }
  });
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetailsResponse> => {
  return fetchDataV3(`/movie/${movieId}`);
};

// Search movies
export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  return fetchDataV3(`/search/movie`, {
    params: { query, page }
  });
};

// Add to movieService.ts
export const getMovieAccountStates = async (movieId: number, sessionId: string) => {
  try {
    return await fetchDataV3(`/movie/${movieId}/account_states`, {
      params: {
        session_id: sessionId
      }
    });
  } catch (error) {
    console.error('Error getting movie account states:', error);
    // Return default values if API call fails
    return {
      favorite: false,
      watchlist: false
    };
  }
};

// Add/remove from watchlist
export const toggleWatchlist = async (userId: number, movieId: number, add: boolean, sessionId: string) => {
  return await fetchDataV3(`/account/${userId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    params: { session_id: sessionId },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: movieId,
      watchlist: add
    })
  });
};

// Add/remove from favorites
export const toggleFavorite = async (
  userId: number, 
  movieId: number,
  add: boolean,
  sessionId: string
): Promise<{ success: boolean }> => {
  return fetchDataV3(`/account/${userId}/favorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    params: { session_id: sessionId },
    body: JSON.stringify({
      media_type: 'movie',
      media_id: movieId,
      favorite: add
    })
  });
};

// Get user's watchlist
export const getWatchlist = async (
  accountId: number,
  sessionId: string,
  page = 1
): Promise<WatchlistResponse> => {
  return fetchDataV3(`/account/${accountId}/watchlist/movies`, {
    params: { session_id: sessionId, page }
  });
};

// Get user's favorites
export const getFavorites = async (
  accountId: number,
  sessionId: string,
  page = 1
): Promise<WatchlistResponse> => {
  return fetchDataV3(`/account/${accountId}/favorite/movies`, {
    params: { session_id: sessionId, page }
  });
};

// Rate a movie
export const rateMovie = async (
  movieId: number,
  rating: number,
  sessionId: string
): Promise<{ success: boolean }> => {
  return fetchDataV3(`/movie/${movieId}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },  // Add this header
    params: { session_id: sessionId },
    body: JSON.stringify({
      value: rating
    })
  });
};

export const deleteRating = async (
  movieId: number,
  sessionId: string
): Promise<{ success: boolean }> => {
  return fetchDataV3(`/movie/${movieId}/rating`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    params: { session_id: sessionId }
  });
};

// Check if movie is in watchlist
export const checkMovieWatchlist = async (
  accountId: number,
  movieId: number,
  sessionId: string
): Promise<MovieAccountStates> => {
  return fetchDataV3(`/movie/${movieId}/account_states`, {
    params: { session_id: sessionId }
  });
};

// Check if movie is favorited
export const checkMovieFavorite = async (
  accountId: number,
  movieId: number,
  sessionId: string
): Promise<MovieAccountStates> => {
  return fetchDataV3(`/movie/${movieId}/account_states`, {
    params: { session_id: sessionId }
  });
};

export default {
  getNowPlayingMovies,
  getMovieAccountStates,
  getTopRatedMovies,
  getMovieDetails,
  searchMovies,
  toggleWatchlist,
  toggleFavorite,
  getWatchlist,
  getFavorites,
  rateMovie,
  deleteRating,
  checkMovieWatchlist,
  checkMovieFavorite
};