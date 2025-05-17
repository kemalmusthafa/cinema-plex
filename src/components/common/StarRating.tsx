
import React, { useState } from 'react';

interface StarRatingProps {
  initialRating: number | null;
  onRatingChange: (rating: number | null) => void;
  disabled?: boolean;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating,
  onRatingChange,
  disabled = false,
  maxStars = 5
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingClick = (value: number) => {
    if (disabled) return;
    
    // If clicking the same star twice, clear the rating
    if (rating === value) {
      setRating(null);
      onRatingChange(null);
    } else {
      setRating(value);
      onRatingChange(value);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleRatingClick(starValue)}
              onMouseEnter={() => !disabled && setHoverRating(starValue)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              className={`text-2xl px-1 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              disabled={disabled}
              aria-label={`Rate ${starValue} out of ${maxStars} stars`}
            >
              {starValue <= (displayRating || 0) ? (
                <span className="text-yellow-400">★</span>
              ) : (
                <span className="text-gray-400">☆</span>
              )}
            </button>
          );
        })}
      </div>
      
      {displayRating && (
        <span className="ml-4 text-gray-300">
          <span className="font-bold text-yellow-500">{displayRating}</span>/{maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;