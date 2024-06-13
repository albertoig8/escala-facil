// src/pages/Recepcao/Recepcao.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../../firebase';
import './Recepcao.css';

const Recepcao = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="recepcao-container">
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar src={user.photoURL} alt={user.displayName} />
            </ListItemAvatar>
            <ListItemText primary={user.displayName} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Recepcao;
