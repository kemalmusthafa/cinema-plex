import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Movie } from '../types';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieGrid from '../components/movie/MovieGrid';
import movieService from '../services/movieService';


const FavoritesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await movieService.getFavorites(user.id, user.session_id);
        setMovies(response.results);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, isAuthenticated]);

  const handleFavoriteToggle = (movieId: number, isFavorite: boolean) => {
    if (!isFavorite) {
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
        <h1 className="text-3xl font-bold text-white mb-6">Your Favorite Movies</h1>

        <MovieGrid
          title=""
          movies={movies}
          loading={loading}
          onFavoriteToggle={handleFavoriteToggle}
        />

        {!loading && movies.length === 0 && (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">You don't have any favorite movies yet</h2>
            <p className="text-gray-400">
              Movies you mark as favorite will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;