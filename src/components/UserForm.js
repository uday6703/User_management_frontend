
// UserForm component handles both create and edit user
// TODO: Add phone number validation, show loading state
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post, put } from '../api';

const initialState = {
  name: '', email: '', phone: '', company: '',
  address: { street: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }
};

function UserForm({ editMode }) {
  const [user, setUser] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      get(`/api/users/${id}`)
        .then(res => {
          setUser(res.data);
          // Debug: log loaded user
          console.log('Loaded user for edit:', res.data.email);
        })
        .catch(() => setError('User not found'));
    }
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    // TODO: Refactor for better nested state handling
    if (name.startsWith('address.')) {
      const [_, field, sub] = name.split('.');
      setUser(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: sub ? { ...prev.address[field], [sub]: value } : value
        }
      }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    // TODO: Add more robust validation
    if (!user.name || !user.email || !user.phone || !user.company || !user.address.street || !user.address.city || !user.address.zipcode || !user.address.geo.lat || !user.address.geo.lng) {
      return 'All fields are required.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user.email)) {
      return 'Invalid email format.';
    }
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    try {
      if (editMode) {
        await put(`/api/users/${id}`, user);
        // Debug: log update
        console.log('Updated user:', user.email);
      } else {
        await post('/api/users', user);
        // Debug: log creation
        console.log('Created user:', user.email);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving user');
    }
  };

  return (
    <div className="container">
      <h2>{editMode ? 'Edit User' : 'Add User'}</h2>
      {/* TODO: Show error messages near fields */}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={user.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" value={user.email} onChange={handleChange} required type="email" />
        <label>Phone</label>
        <input name="phone" value={user.phone} onChange={handleChange} required />
        <label>Company</label>
        <input name="company" value={user.company} onChange={handleChange} required />
        <label>Street</label>
        <input name="address.street" value={user.address.street} onChange={handleChange} required />
        <label>City</label>
        <input name="address.city" value={user.address.city} onChange={handleChange} required />
        <label>Zipcode</label>
        <input name="address.zipcode" value={user.address.zipcode} onChange={handleChange} required />
        <label>Geo Lat</label>
        <input name="address.geo.lat" value={user.address.geo.lat} onChange={handleChange} required />
        <label>Geo Lng</label>
        <input name="address.geo.lng" value={user.address.geo.lng} onChange={handleChange} required />
        <button type="submit">{editMode ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default UserForm;
