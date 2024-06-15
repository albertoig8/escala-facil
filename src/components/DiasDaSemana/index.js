import React, { useState, useEffect } from 'react';
import { List, ListItemAvatar, ListItemText, Avatar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { format, getDaysInMonth, setMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import DiaModal from '../DiaModal';  // Importar o novo componente de modal
import './styles.css';

const DiasDaSemana = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [daysList, setDaysList] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null); // Estado para controlar o dia selecionado
    const [openModal, setOpenModal] = useState(false);    // Estado para controlar a abertura do modal
    const db = getFirestore();

    useEffect(() => {
        generateDaysList(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const fetchEscalas = async (year, month) => {
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

        const q = query(
            collection(db, 'escalas'),
            where('data', '>=', startDate),
            where('data', '<=', endDate)
        );

        const querySnapshot = await getDocs(q);
        const escalas = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            escalas[data.data] = data;
        });

        return escalas;
    };

    const generateDaysList = async (year, month) => {
        const daysInMonth = getDaysInMonth(new Date(year, month));
        const days = [];
        const daysToInclude = [0, 3, 6]; // Domingo (0), Quarta (3), Sábado (6)

        const escalas = await fetchEscalas(year, month);

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(year, month, i);
            if (daysToInclude.includes(currentDay.getDay())) {
                const dateStr = currentDay.toISOString().split('T')[0];
                const escala = escalas[dateStr] || {};

                days.push({
                    day: i < 10 ? `0${i}` : i, // Adicionar zero se o dia for menor que 10
                    weekDay: format(currentDay, 'EEEE', { locale: ptBR }),
                    dayOfWeek: currentDay.getDay(),
                    date: currentDay,
                    selectedPrevios: escala.previos || null,
                    selectedLouvor: escala.louvorEspecial || null,
                });
            }
        }
        setDaysList(days);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleDayClick = async (day) => {
        setSelectedDay(day);
        setOpenModal(true);
    };

    const getDayClass = (dayOfWeek) => {
        switch (dayOfWeek) {
            case 0: return 'domingo';
            case 3: return 'quarta';
            case 6: return 'sabado';
            default: return '';
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedDay(null);
    };

    return (
        <div className="dias-semana-container">
            <div className="filter-container-semana">
                <FormControl className="dias-semana-month-select" variant="outlined" margin="normal">
                    <InputLabel id="month-select-label">Mês</InputLabel>
                    <Select
                        labelId="month-select-label"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Mês"
                    >
                        {Array.from({ length: 12 }).map((_, index) => (
                            <MenuItem key={index} value={index}>
                                {format(setMonth(new Date(), index), 'MMMM', { locale: ptBR })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="dias-semana-year-select" variant="outlined" margin="normal">
                    <InputLabel id="year-select-label">Ano</InputLabel>
                    <Select
                        labelId="year-select-label"
                        value={selectedYear}
                        onChange={handleYearChange}
                        label="Ano"
                    >
                        {Array.from({ length: 10 }).map((_, index) => (
                            <MenuItem key={index} value={new Date().getFullYear() - 5 + index}>
                                {new Date().getFullYear() - 5 + index}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {daysList.length > 0 ? (
                <List className='list-dias-semana'>
                    {daysList.map((day, index) => (
                        <div
                            key={index}
                            className={`dias-semana-item-list ${getDayClass(day.dayOfWeek)}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="avatar-quadrado">
                                {day.day}
                            </div>
                            <div className="dias-semana-item-container-name-day">
                                <ListItemText className='dias-semana-nome-dia' primary={day.weekDay.toUpperCase()} />
                                <div className='container-dias-semana-pessoas-selecionadas'>
                                    {day.selectedPrevios && (
                                        <div className='dias-semana-pessoas-selecionadas'>
                                            <p>{day.selectedPrevios.name}</p>
                                            <Avatar src={day.selectedPrevios.photoURL} className="selected-avatar" />
                                        </div>
                                    )}
                                    {day.selectedLouvor && (
                                        <div className='dias-semana-pessoas-selecionadas'>
                                            <p>{day.selectedLouvor.name}</p>
                                            <Avatar src={day.selectedLouvor.photoURL} className="selected-avatar" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {selectedDay && day.date.getTime() === selectedDay.date.getTime() && (
                                <DiaModal
                                    open={openModal}
                                    onClose={handleCloseModal}
                                    day={selectedDay}
                                    db={db}
                                    setSelectedPrevios={(person) => setSelectedDay((prev) => ({ ...prev, selectedPrevios: person }))}
                                    setSelectedLouvor={(person) => setSelectedDay((prev) => ({ ...prev, selectedLouvor: person }))}
                                />
                            )}
                        </div>
                    ))}
                </List>
            ) : (
                <p className="dias-semana-nao-encontrado__p">Nenhum dia encontrado.</p>
            )}
        </div>
    );
};

export default DiasDaSemana;
