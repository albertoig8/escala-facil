import React, { useEffect, useState } from 'react';
import { List, ListItemAvatar, ListItemText, Avatar, TextField } from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './styles.css';

const Pessoas = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore();
  const usersCollectionRef = collection(db, 'users');

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(usersCollectionRef);
      const users = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(users);
    };

    getUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="usuario-container">
      <TextField
        className='usuario-buscar-por'
        label="Buscar por..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredUsers.length > 0 ? (
        <List>
          {filteredUsers.map((user) => (
            <div key={user.id} className='usuario-item-list'>
              <div className='usuario-item-container-avatar-name'>
                <ListItemAvatar>
                  <Avatar src={user.photoURL} alt={user.displayName || 'User Avatar'} />
                </ListItemAvatar>
                <ListItemText primary={user.displayName || 'Usuário sem nome'} />
              </div>
              <div className='usuario-item-container-email'>
                <ListItemText primary={user.email || ''} />
              </div>
            </div>
          ))}
        </List>
      ) : (
        <p className='usuario-nao-encontrado__p'>Nenhuma pessoa encontrada.</p>
      )}
    </div>
  );
};

export default Pessoas;
