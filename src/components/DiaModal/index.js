import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import './styles.css'; // Importando o arquivo CSS

const DiaModal = ({ open, onClose, day, db, setSelectedPrevios, setSelectedLouvor }) => {
    const [searchTermPrevios, setSearchTermPrevios] = useState('');
    const [searchTermLouvor, setSearchTermLouvor] = useState('');
    const [usersPrevios, setUsersPrevios] = useState([]);
    const [usersLouvor, setUsersLouvor] = useState([]);
    const [selectedPreviosLocal, setSelectedPreviosLocal] = useState(null);
    const [selectedLouvorLocal, setSelectedLouvorLocal] = useState(null);
    const [previosVisible, setPreviosVisible] = useState(false);
    const [louvorVisible, setLouvorVisible] = useState(false);
    const [editPrevios, setEditPrevios] = useState(false); // Estado para controlar se está editando previos
    const [editLouvor, setEditLouvor] = useState(false); // Estado para controlar se está editando louvor

    useEffect(() => {
        if (previosVisible) {
            fetchUsers('previos');
            setLouvorVisible(false); // Fechar seleção de louvor ao abrir seleção de previos
        }
        if (louvorVisible) {
            fetchUsers('louvor');
            setPreviosVisible(false); // Fechar seleção de previos ao abrir seleção de louvor
        }
    }, [previosVisible, louvorVisible]);

    useEffect(() => {
        // Carregar dados previamente salvos para a data selecionada
        const loadSavedData = async () => {
            const docRef = doc(db, 'escalas', format(day.date, 'yyyy-MM-dd'));
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { previos, louvorEspecial } = docSnap.data();
                setSelectedPreviosLocal(previos);
                setSelectedLouvorLocal(louvorEspecial);
            }
        };

        loadSavedData();
    }, [day, db, setSelectedPreviosLocal, setSelectedLouvorLocal]);

    const fetchUsers = async (type) => {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        const users = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        if (type === 'previos') {
            setUsersPrevios(users);
        } else if (type === 'louvor') {
            setUsersLouvor(users);
        }
    };

    const handleSearchChangePrevios = (event) => {
        setSearchTermPrevios(event.target.value);
    };

    const handleSearchChangeLouvor = (event) => {
        setSearchTermLouvor(event.target.value);
    };

    const handleSelectPrevios = (user) => {
        setSelectedPreviosLocal({ name: user.displayName, photoURL: user.photoURL });
        setPreviosVisible(false); // Esconder a lista de usuários
        setEditPrevios(false); // Parar de editar previos
    };

    const handleSelectLouvor = (user) => {
        setSelectedLouvorLocal({ name: user.displayName, photoURL: user.photoURL });
        setLouvorVisible(false); // Esconder a lista de usuários
        setEditLouvor(false); // Parar de editar louvor
    };

    const handleEditPrevios = () => {
        setPreviosVisible(true); // Mostrar a lista de usuários para editar
        setLouvorVisible(false); // Fechar seleção de louvor ao abrir seleção de previos
        setEditPrevios(true); // Começar a editar previos
    };

    const handleEditLouvor = () => {
        setLouvorVisible(true); // Mostrar a lista de usuários para editar
        setPreviosVisible(false); // Fechar seleção de previos ao abrir seleção de louvor
        setEditLouvor(true); // Começar a editar louvor
    };

    const handleSave = async () => {
        setSelectedPrevios(selectedPreviosLocal);
        setSelectedLouvor(selectedLouvorLocal);
        const dataToSave = {
            previos: selectedPreviosLocal,
            louvorEspecial: selectedLouvorLocal,
            data: format(day.date, 'yyyy-MM-dd'),
        };

        await setDoc(doc(db, 'escalas', format(day.date, 'yyyy-MM-dd')), dataToSave);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className='modal-container'
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    maxHeight: '80vh', // Definindo altura máxima para o modal
                    overflowY: 'auto', // Habilitando scroll vertical quando necessário
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2 className='day-modal-title'>{`Dia ${day.day} - ${day.weekDay}`}</h2>

                {!editPrevios && selectedPreviosLocal ? (
                    <div className='section-label'>
                        <span>Previos:</span>
                        <Box className='dia-modal-user-info' sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '10px', cursor: 'pointer' }} onClick={handleEditPrevios}>
                            <Avatar src={selectedPreviosLocal.photoURL} />
                            <span>{selectedPreviosLocal.name}</span>
                        </Box>
                    </div>
                ) : (
                    <TextField
                        label="Buscar pessoa para prévios"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTermPrevios}
                        onChange={handleSearchChangePrevios}
                        onClick={handleEditPrevios} // Atualizado para abrir a lista de usuários
                    />
                )}
                {previosVisible && (
                    <List sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
                        {usersPrevios
                            .filter((user) => user.displayName?.toLowerCase().includes(searchTermPrevios.toLowerCase()))
                            .map((user) => (
                                <ListItem button key={user.id} onClick={() => handleSelectPrevios(user)}>
                                    <ListItemAvatar>
                                        <Avatar src={user.photoURL} />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.displayName} />
                                </ListItem>
                            ))}
                    </List>
                )}

                {!editLouvor && selectedLouvorLocal ? (
                    <div className='section-label'>
                        <span>Louvor especial:</span>
                        <Box className='dia-modal-user-info' sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '10px', cursor: 'pointer' }} onClick={handleEditLouvor}>
                            <Avatar src={selectedLouvorLocal.photoURL} />
                            <span>{selectedLouvorLocal.name}</span>
                        </Box>
                    </div>
                ) : (
                    <TextField
                        label="Buscar pessoa para louvor especial"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTermLouvor}
                        onChange={handleSearchChangeLouvor}
                        onClick={handleEditLouvor} // Atualizado para abrir a lista de usuários
                    />
                )}
                {louvorVisible && (
                    <List sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
                        {usersLouvor
                            .filter((user) => user.displayName?.toLowerCase().includes(searchTermLouvor.toLowerCase()))
                            .map((user) => (
                                <ListItem button key={user.id} onClick={() => handleSelectLouvor(user)}>
                                    <ListItemAvatar>
                                        <Avatar src={user.photoURL} />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.displayName} />
                                </ListItem>
                            ))}
                    </List>
                )}

                <Button variant="contained" onClick={handleSave}>
                    Salvar
                </Button>
            </Box>
        </Modal>
    );
};

export default DiaModal;
