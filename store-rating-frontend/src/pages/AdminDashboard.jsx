import { useState, useEffect } from 'react';
import api from '../utils/api';
import CreateUserForm from '../components/CreateUserForm';
import CreateStoreForm from '../components/CreateStoreForm';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">System Administrator Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            System Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Manage Stores
          </button>
        </li>
      </ul>

      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Users</h6>
                <h2 className="mb-0">{stats.totalUsers}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Stores</h6>
                <h2 className="mb-0">{stats.totalStores}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Ratings Submitted</h6>
                <h2 className="mb-0">{stats.totalRatings}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Add New User</h5>
          </div>
          <div className="card-body">
            <CreateUserForm onSuccess={fetchStats} />
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Register New Store</h5>
          </div>
          <div className="card-body">
            <CreateStoreForm onSuccess={fetchStats} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;