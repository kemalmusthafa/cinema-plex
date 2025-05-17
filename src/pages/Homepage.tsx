import React, { useEffect, useState } from 'react';

import MovieGrid from '../components/movie/MovieGrid';
import movieService from '../services/movieService';
import type { Movie } from '../types';
import Layout from '../components/layout/Layout';


const HomePage: React.FC = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loadingNowPlaying, setLoadingNowPlaying] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const nowPlayingResponse = await movieService.getNowPlayingMovies();
        setNowPlayingMovies(nowPlayingResponse.results);
        setLoadingNowPlaying(false);
      } catch (error) {
        console.error('Error fetching now playing movies:', error);
        setLoadingNowPlaying(false);
      }

      try {
        const topRatedResponse = await movieService.getTopRatedMovies();
        setTopRatedMovies(topRatedResponse.results);
        setLoadingTopRated(false);
      } catch (error) {
        console.error('Error fetching top rated movies:', error);
        setLoadingTopRated(false);
      }
    };

    fetchMovies();
  }, []);

  const handleWatchlistToggle = (movieId: number, isWatchlist: boolean) => {
    // You could update your global state or re-fetch data here if needed
    console.log(`Movie ${movieId} ${isWatchlist ? 'added to' : 'removed from'} watchlist`);
  };

  const handleFavoriteToggle = (movieId: number, isFavorite: boolean) => {
    // You could update your global state or re-fetch data here if needed
    console.log(`Movie ${movieId} ${isFavorite ? 'added to' : 'removed from'} favorites`);
  };

  return (
    <Layout>
      <div className="space-y-10">
        <MovieGrid
          title="Now Playing"
          movies={nowPlayingMovies}
          loading={loadingNowPlaying}
          onWatchlistToggle={handleWatchlistToggle}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <MovieGrid
          title="Top Rated"
          movies={topRatedMovies}
          loading={loadingTopRated}
          onWatchlistToggle={handleWatchlistToggle}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    </Layout>
  );
};

export default HomePage;