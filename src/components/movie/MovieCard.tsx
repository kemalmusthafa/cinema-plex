import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import movieService from '../../services/movieService';
import type { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movieId: number, isFavorite: boolean) => void;
  onWatchlistToggle?: (movieId: number, isWatchlist: boolean) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onFavoriteToggle,
  onWatchlistToggle
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial state when component mounts
  useEffect(() => {
    const fetchMovieStatus = async () => {
      if (!isAuthenticated || !user || !movie) return;
      
      try {
        // Get movie account states (favorite, watchlist)
        const accountStates = await movieService.getMovieAccountStates(movie.id, user.session_id);
        setInWatchlist(accountStates.watchlist);
        setIsFavorite(accountStates.favorite);
      } catch (error) {
        console.error('Error fetching movie status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieStatus();
  }, [movie, user, isAuthenticated]);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) return;
    
    try {
      const newState = !inWatchlist;
      await movieService.toggleWatchlist(user.id, movie.id, newState, user.session_id);
      setInWatchlist(newState);
      
      if (onWatchlistToggle) {
        onWatchlistToggle(movie.id, newState);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) return;
    
    try {
      const newState = !isFavorite;
      await movieService.toggleFavorite(user.id, movie.id, newState, user.session_id);
      setIsFavorite(newState);
      
      if (onFavoriteToggle) {
        onFavoriteToggle(movie.id, newState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 bg-gray-800 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full object-cover h-80"
        />
        
        {/* Hover overlay */}
        {isHovered && isAuthenticated && !isLoading && (
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button 
              onClick={toggleWatchlist}
              className="p-2 bg-gray-900 bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <svg className={`w-5 h-5 ${inWatchlist ? 'text-yellow-500' : 'text-white'}`} 
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
              </svg>
            </button>
            
            <button 
              onClick={toggleFavorite}
              className="p-2 bg-gray-900 bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg className={`w-5 h-5 ${isFavorite ? 'text-yellow-500' : 'text-white'}`} 
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
            </span>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-white">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;