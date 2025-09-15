
// UserDetails component shows details for a single user
// TODO: Add avatar/profile picture
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { get, del } from '../api';

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    get(`/api/users/${id}`)
      .then(res => {
        setUser(res.data);
        // Debug: log loaded user details
        console.log('Loaded user details:', res.data.email);
      })
      .catch(() => setError('User not found'));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Delete this user?')) {
      try {
        await del(`/api/users/${id}`);
        // Debug: log deletion
        console.log('Deleted user:', id);
        navigate('/');
      } catch {
        setError('Failed to delete user');
      }
    }
  };

  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{user.name}</h2>
      {/* TODO: Add more user info here */}
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone}</p>
      <p><b>Company:</b> {user.company}</p>
      <p><b>Address:</b> {user.address.street}, {user.address.city}, {user.address.zipcode}</p>
      <p><b>Geo:</b> {user.address.geo.lat}, {user.address.geo.lng}</p>
      <Link to={`/edit/${user._id}`}><button>Edit</button></Link>
      <button onClick={handleDelete} style={{marginLeft:'1rem', background:'#dc3545'}}>Delete</button>
      <br /><br />
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
}

export default UserDetails;
