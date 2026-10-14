import { useState } from 'react';
import api from '../utils/api';

const CreateUserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await api.post('/admin/users', formData);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors.join(' | ') 
        : (err.response?.data?.message || 'Failed to create user');
      setMessage({ type: 'danger', text: errorMsg });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required minLength="20" maxLength="60" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?]).{8,16}$" title="8-16 chars, 1 uppercase, 1 special char" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Role</label>
          <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="NORMAL">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Address</label>
          <textarea className="form-control" rows="2" maxLength="400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required></textarea>
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary">Create User</button>
        </div>
      </div>
    </form>
  );
};

export default CreateUserForm;