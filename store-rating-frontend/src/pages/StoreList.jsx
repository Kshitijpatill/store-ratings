import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import StarRating from '../components/StarRating';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        name: searchTerm,
        address: addressFilter,
        sortBy,
        order: sortOrder
      });
      
      const response = await api.get(`/stores?${queryParams.toString()}`);
      setStores(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, addressFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Browse Stores</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body bg-light">
          <div className="row g-3">
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by Store Name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Filter by Address" 
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="overall_rating">Sort by Rating</option>
                <option value="address">Sort by Address</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && !stores.length ? (
        <div className="text-center mt-5"><div className="spinner-border"></div></div>
      ) : stores.length === 0 ? (
        <div className="alert alert-info text-center">No stores found matching your criteria.</div>
      ) : (
        <div className="row g-4">
          {stores.map((store) => (
            <div key={store.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{store.name}</h5>
                  <h6 className="card-subtitle mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-geo-alt-fill me-1"></i> {store.address}
                  </h6>
                  
                  <div className="mt-auto pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted small">Overall Rating:</span>
                      <span className="badge bg-secondary fs-6">
                        {parseFloat(store.overall_rating).toFixed(1)} / 5
                      </span>
                    </div>
                    
                    <div className="bg-light p-3 rounded text-center">
                      <p className="mb-2 small fw-bold">
                        {store.my_rating ? 'Modify your rating:' : 'Rate this store:'}
                      </p>
                      <StarRating 
                        storeId={store.id} 
                        initialRating={store.my_rating || 0} 
                        onRatingSuccess={fetchStores} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;