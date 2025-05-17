import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getImageUrl } from "../services/api";
import movieService from "../services/movieService";
import { useAuth } from "../context/AuthContext";
import { type MovieDetailsResponse } from "../types";
import Loading from "../components/common/Loading";
import StarRating from "../components/common/StarRating";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<MovieDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        const movieId = parseInt(id);
        const movieData = await movieService.getMovieDetails(movieId);
        setMovie(movieData);

        // If user is authenticated, check watchlist and favorite status
        if (isAuthenticated && user) {
          try {
            const accountStates = await movieService.checkMovieWatchlist(
              user.id,
              movieId,
              user.session_id
            );

            setInWatchlist(accountStates.watchlist);
            setIsFavorite(accountStates.favorite);

            // Check if user has rated this movie
            if (accountStates.rated) {
              setUserRating(accountStates.rated.value);
            }
          } catch (error) {
            console.error("Error checking movie status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, user, isAuthenticated]);

  const toggleWatchlist = async () => {
    if (!movie || !isAuthenticated || !user) return;

    try {
      const newState = !inWatchlist;
      await movieService.toggleWatchlist(
        user.id,
        movie.id,
        newState,
        user.session_id
      );
      setInWatchlist(newState);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!movie || !isAuthenticated || !user) return;

    try {
      const newState = !isFavorite;
      await movieService.toggleFavorite(
        user.id,
        movie.id,
        newState,
        user.session_id
      );
      setIsFavorite(newState);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleRatingChange = async (rating: number | null) => {
    if (!movie || !isAuthenticated || !user) return;

    setSubmittingRating(true);

    try {
      if (rating === null) {
        // Delete rating
        await movieService.deleteRating(movie.id, user.session_id);
      } else {
        // Set rating
        await movieService.rateMovie(movie.id, rating, user.session_id);
      }
      setUserRating(rating);
    } catch (error) {
      console.error("Error updating movie rating:", error);
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Movie Not Found
          </h2>
          <p className="text-gray-400">
            The movie you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        {/* Backdrop image */}
        <div className="relative h-96 mb-8 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 p-6 z-20">
            <h1 className="text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-300 text-xl italic">{movie.tagline}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster and actions */}
          <div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full"
              />
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={toggleWatchlist}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      inWatchlist
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                    </svg>
                    <span>
                      {inWatchlist
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"}
                    </span>
                  </button>

                  <button
                    onClick={toggleFavorite}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      isFavorite
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span>
                      {isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </span>
                  </button>
                </>
              ) : (
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-gray-400 mb-2">
                    Log in with TMDB to add this movie to your watchlist or
                    favorites.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Movie info */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-yellow-600 px-3 py-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-white mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-white font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                <div className="text-gray-300">
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString()
                    : "Unknown date"}
                </div>

                {movie.runtime > 0 && (
                  <div className="text-gray-300">
                    {formatRuntime(movie.runtime)}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Overview</h3>
              <p className="text-gray-300 mb-6">
                {movie.overview || "No overview available for this movie."}
              </p>

              {/* User rating */}
              {isAuthenticated && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Rate This Movie
                  </h3>
                  <div>
                    <StarRating
                      initialRating={userRating}
                      onRatingChange={handleRatingChange}
                      disabled={submittingRating}
                      maxStars={10}
                    />
                    {userRating === null && (
                      <p className="text-gray-400 text-sm mt-2">
                        Click on a star to rate, click again to cancel rating
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetailsPage;
