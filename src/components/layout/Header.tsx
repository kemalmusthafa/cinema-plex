import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../common/SearchBar';

const Header: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-500">
            CinemaPlex
          </Link>
          
          <div className="hidden md:block w-1/3">
            <SearchBar />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-400 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/watchlist" className="hover:text-red-400 transition-colors">
                  Watchlist
                </Link>
                <Link to="/favorites" className="hover:text-red-400 transition-colors">
                  Favorites
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors hover:cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors hover:cursor-pointer"
              >
                Login with TMDB
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile search bar */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" className="block hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/watchlist" className="block hover:text-red-400 transition-colors">
                      Watchlist
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="block hover:text-red-400 transition-colors">
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button 
                    onClick={handleLogin}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Login with TMDB
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;