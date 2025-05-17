import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MovieGrid from '../components/movie/MovieGrid';
import movieService from '../services/movieService';
import type { Movie } from '../types';


const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await movieService.searchMovies(query, currentPage);
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">
          {query ? `Search Results for: "${query}"` : 'Search Results'}
        </h1>

        <MovieGrid
          title=""
          movies={movies}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center px-4 text-white">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;