const API_KEY = '7d2381c5682cdf6da502ddee007148f3'; 
const BASE_URL_V3 = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  method?: string;
  body?: string;
}

// Function to make v3 API requests with improved error handling
export const fetchDataV3 = async (endpoint: string, options: ApiOptions = {}) => {
  try {
    const { params = {}, headers = {}, method = 'GET', body } = options;
    
    // Build URL with query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('api_key', API_KEY);
    
    // Add additional params
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    
    // Complete URL
    const url = `${BASE_URL_V3}${endpoint}?${queryParams.toString()}`;
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      fetchOptions.body = body;
    }
    
    console.log(`Making API request to: ${endpoint}`);
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
};

// Get image URL with fallback
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return '/placeholder-image.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default { fetchDataV3, getImageUrl };