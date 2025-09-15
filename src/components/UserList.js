
// UserList component displays all users in a table
// TODO: Add search/filter functionality
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
        // Debug: log users fetched
        console.log('Fetched users:', res.data.length);
      })
      .catch(() => setError('Failed to fetch users'));
  }, []);

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      {/* TODO: Add loading spinner */}
      {error && <div className="error">{error}</div>}
      <table width="100%" border="1" cellPadding="8" style={{background:'#fff'}}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.company}</td>
              <td>
                <Link to={`/user/${user._id}`}>View</Link> |{' '}
                <Link to={`/edit/${user._id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/create"><button style={{marginTop:'1rem'}}>Add User</button></Link>
    </div>
  );
}

export default UserList;
