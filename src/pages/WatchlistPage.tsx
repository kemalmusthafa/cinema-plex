import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieGrid from '../components/movie/MovieGrid';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';
import type { Movie } from '../types';


const WatchlistPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await movieService.getWatchlist(user.id, user.session_id);
        setMovies(response.results);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, isAuthenticated]);

  const handleWatchlistToggle = (movieId: number, isWatchlist: boolean) => {
    if (!isWatchlist) {
      // Remove from UI immediately
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Your Watchlist</h1>

        <MovieGrid
          title=""
          movies={movies}
          loading={loading}
          onWatchlistToggle={handleWatchlistToggle}
        />

        {!loading && movies.length === 0 && (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400">
              Movies you add to your watchlist will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WatchlistPage;