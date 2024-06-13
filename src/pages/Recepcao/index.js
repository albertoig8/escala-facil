// src/pages/Recepcao/Recepcao.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { getAuth } from 'firebase/auth';
import './styles.css';

const Recepcao = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUsers([{
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                }]);
            }
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