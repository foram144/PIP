import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [id, setId] = useState('');
    const [users, setUsers] = useState([]);
    const [user, serUser] = useState(null);

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        setUsers(response.data[0]);
      } catch (error) {
        alert('Error fetching users')
      }
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/users/', { name, surname });
            alert('User added successfully');
            setName('');
            setSurname('');
            fetchUsers();
        } catch (error) {
            alert('Error adding user')
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8080/users/${id}`);
            alert('User deleted successfully');
            setId('');
            fetchUsers();
        } catch (error) {
            alert('Error deleting user')
        }
    }
    
  return (
    <div className="App">
      <h1>User Management</h1>

      <form onSubmit={handleAddUser}>
          <h2>Add User</h2>
          <label>Name:
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br/>
          <label>surname:
              <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)} />
          </label>
          <br/>
          <button type='submit'>Add user</button>
      </form>

      <form onSubmit={handleDeleteUser}>
        <h2>Delete User</h2>
        <label>User ID:
              <input type='text' value={id} onChange={(e) => setId(e.target.value)} />
          </label>
          <br/>
          <button type='submit'>Delete user</button>
      </form>

      {user && (
          <div>
              <h3>User Details</h3>
              <p>ID: {user.id}</p>
              <p>Name: {user.name}</p>
              <p>Surname: {user.surname}</p>
          </div>
      )}
    </div>
  );
};

export default App;
