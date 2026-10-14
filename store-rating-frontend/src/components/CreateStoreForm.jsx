import { useState, useEffect } from 'react';
import api from '../utils/api';

const CreateStoreForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get('/admin/users?role=STORE_OWNER');
        setOwners(response.data);
      } catch (err) {
        console.error("Could not fetch store owners for dropdown");
      }
    };
    fetchOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await api.post('/stores', formData);
      setMessage({ type: 'success', text: 'Store registered successfully!' });
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to register store' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Store Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Store Contact Email</label>
          <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="col-md-12">
          <label className="form-label">Assign Store Owner</label>
          <select className="form-select" value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})} required>
            <option value="" disabled>Select an Owner...</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
          <div className="form-text">Only users with the 'Store Owner' role appear here.</div>
        </div>
        <div className="col-md-12">
          <label className="form-label">Physical Address</label>
          <textarea className="form-control" rows="2" maxLength="400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required></textarea>
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary">Register Store</button>
        </div>
      </div>
    </form>
  );
};

export default CreateStoreForm;