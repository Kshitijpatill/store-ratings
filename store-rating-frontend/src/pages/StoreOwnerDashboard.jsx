import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("You don't have any stores assigned to you yet. Please contact the System Administrator.");
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Welcome, {user.name}</h2>
      
      {error && <div className="alert alert-warning">{error}</div>}

      {dashboardData && (
        <>
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm text-center bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">{dashboardData.store.name}</h5>
                  <p className="card-text mb-1">Average Rating</p>
                  <h2 className="display-4 fw-bold">
                    {dashboardData.store.averageRating.toFixed(1)} <span className="fs-4">/ 5</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Recent Reviews</h5>
            </div>
            <div className="card-body p-0">
              {dashboardData.reviews.length === 0 ? (
                <div className="p-4 text-center text-muted">No one has rated your store yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.reviews.map((review) => (
                        <tr key={review.rating_id}>
                          <td>{review.name}</td>
                          <td>{review.email}</td>
                          <td>
                            <span className="badge bg-warning text-dark fs-6">
                              {review.rating} ★
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;