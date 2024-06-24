import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';

const apiUrl = 'http://Ec2Alb-1134731512.eu-north-1.elb.amazonaws.com';

const App = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [viewId, setViewId] = useState('');
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [healthStatus, setHealthStatus] = useState('Checking')

    const checkHealth = async () => {
      try {
        await axios.get(`${apiUrl}:8080/health`);
        setHealthStatus('Healthy');
      } catch (error) {
        setHealthStatus('Failing');
      }
    };

    useEffect(() => {
      checkHealth();
      const interval = setInterval(() => {
        checkHealth();
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}:8080/users`);
        setUsers(response.data[0]);
      } catch (error) {
        alert('Error fetching users')
      }
    }

    useEffect(() => {
      fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        if ( !name || !surname ) {
          alert('Name and surname are required');
          return;
        }
        try {
        await axios.post(`${apiUrl}:8080/users`, { name, surname });
        alert('User added successfully');
        setName('');
        setSurname('');
        fetchUsers();
        } catch (error) {
          if (error.response && error.response.status === 409) {
            alert('User alredy exists');
          } else {
            alert('Error adding user');
          }
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!deleteId) {
          alert('User ID is required');
          return;
        }
        try {
            await axios.delete(`${apiUrl}:8080/users/${deleteId}`);
            alert('User deleted successfully');
            setDeleteId('');
            fetchUsers();
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert('user not found');
          } else {
            alert('Error deleting user')
          }
        }
    }

    const handleViewUser = async (e) => {
      e.preventDefault();
      if (!viewId) {
        alert('User Id is required');
        return;
      }
      try {
          const response = await axios.get(`${apiUrl}:8080/users/${viewId}`);
          if (response.data.length > 0) {
            setUser(response.data[0]);
          } else {
            setUser(null);
            alert('user not found');
          }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert('user not found');
        } else {
          alert('Error fetching user')
        }
      }
  } 
    
  return (
    <div className='container'>
      <h1 className='text-center'>User Management</h1>

          <div className={`card ${healthStatus === 'Healthy' ? 'border-success' : 'border-danger'}`}>
            <div className={`card-header ${healthStatus === 'Healthy' ? 'bg-success' : 'bg-danger'}`}>
              <h2>Health Status</h2>
            </div>
            <div className='card-body'>
              <p className={healthStatus === 'Healthy' ? 'healthy' : 'failing'}>{healthStatus}</p>
            </div>
          </div>
      
          <div  className='card' style={{borderColor: '#17a2b8'}}>
          <div className='card-header bg-info'>
          <h3>Add User</h3>
        </div>
        <div className='card-body'>
        <form onSubmit={handleAddUser}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>Name:</label>
            <input type='text' id='name' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor='surname' className='form-label'>surname:</label>
            <input type='text' id='surname' className='form-control' value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>
          <button type='submit' className='btn btn-primary'>Add user</button>
      </form>
        </div>
          </div>

          <div className='card' style={{borderColor: '#ffc107'}}>
            <div className='card-header bg-warning'>
              <h3>Delete User</h3>
            </div>
            <div className='card-body'>
              <form onSubmit={handleDeleteUser}>
                <div className='mb-3'>
                  <label htmlFor='deleteId' className='form-label'>User ID:</label>
                  <input type='text' id='deleteId' className='form-control' value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
                </div> 
                  <button type='submit' className='btn btn-danger'>Delete user</button>
              </form>
            </div>
          </div>

          <div className='card' style={{borderColor: '#007bff'}}>
            <div className='card-header bg-primary'>
              <h3>View User</h3>
            </div>
            <div className='card-body'>
              <form onSubmit={handleViewUser}>
                <div className='mb-3'>
                  <label htmlFor='viewId' className='form-label'>User ID:</label>
                  <input type="text" id='viewId' className='form-control' value={viewId} onChange={(e) => setViewId(e.target.value)} />
                </div>
                <button type="submit" className='btn btn-info'>View User</button>
              </form>
            </div>
          </div>

      {user && (
          <div className='card' style={{borderColor: '#6c757d'}}>
            <div className='card-header bg-secondary'>
              <h3>User Details</h3>
            </div>
            <div className='card-body'>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Surname:</strong> {user.surname}</p>
            </div>
          </div>
      )}

          <div className='card' style={{borderColor: '##343a40'}}>
            <div className='card-header bg-dark'>
              <h2>View Users</h2>
            </div>
            <div className='card-body'>
              <ul className='list-group'>
              {users.map(user => (
                  <li key={user.id} className='list-group-item'>
                    {user.id} : {user.name} {user.surname}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
  );
};

export default App;
