import React from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../../types';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onFavoriteToggle?: (movieId: number, isFavorite: boolean) => void;
  onWatchlistToggle?: (movieId: number, isWatchlist: boolean) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  title, 
  movies, 
  loading = false,
  onFavoriteToggle,
  onWatchlistToggle
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse"
            >
              <div className="w-full h-80 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onFavoriteToggle={onFavoriteToggle}
              onWatchlistToggle={onWatchlistToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">No movies found</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;