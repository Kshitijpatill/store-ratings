import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([err.response?.data?.message || 'Failed to sign up.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm mt-5">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Create an Account</h2>
          
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {errors.map((err, index) => <li key={index}>{err}</li>)}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                className="form-control" 
                minLength="20"
                maxLength="60"
                value={formData.name}
                onChange={handleChange}
                placeholder="Must be 20-60 characters"
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password"
                className="form-control" 
                pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?]).{8,16}$"
                title="8-16 characters, 1 uppercase, 1 special character"
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <div className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                8-16 chars, at least 1 uppercase & 1 special character.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Address</label>
              <textarea 
                name="address"
                className="form-control" 
                maxLength="400"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required 
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/login">Login here</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;