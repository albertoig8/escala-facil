import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../../firebase';
import './styles.css';

const Recepcao = () => {
  const [users, setUsers] = useState([]);
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

  return (
    <div className="recepcao-container">
      {users.length > 0 ? (
        <List>
          {users.map((user) => (
            <ListItem key={user.id} className='recepcao-item-list'>
              <ListItemAvatar>
                <Avatar src={user.photoURL || 'https://via.placeholder.com/150'} alt={user.displayName || 'User Avatar'} />
              </ListItemAvatar>
              <ListItemText primary={user.displayName || 'Usuário sem nome'} />
            </ListItem>
          ))}
        </List>
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </div>
  );
};

export default Recepcao;
