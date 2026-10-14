import { useState } from 'react';
import api from '../utils/api';

const StarRating = ({ storeId, initialRating, onRatingSuccess }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitRating = async (newRating) => {
    setLoading(true);
    setError('');
    
    try {
      if (initialRating === 0) {
        await api.post('/ratings', { storeId, rating: newRating });
      } else {
        await api.put(`/ratings/${storeId}`, { rating: newRating });
      }
      
      setRating(newRating);
      if (onRatingSuccess) onRatingSuccess();
    } catch (err) {
      setRating(initialRating);
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center" style={{ gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            style={{ 
              fontSize: '1.5rem', 
              color: starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
              transition: 'color 0.2s',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if (!loading && starValue !== rating) {
                setRating(starValue);
                submitRating(starValue);
              }
            }}
            onMouseEnter={() => !loading && setHover(starValue)}
            onMouseLeave={() => !loading && setHover(0)}
            disabled={loading}
          >
            ★
          </button>
        ))}
      </div>
      
      {error && (
        <div className="text-danger mt-2" style={{ fontSize: '0.8rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default StarRating;