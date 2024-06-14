import React, { useState, useEffect } from 'react';
import { List, ListItemAvatar, ListItemText, Avatar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { format, getDaysInMonth, setMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './styles.css';

const DiasDaSemana = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [daysList, setDaysList] = useState([]);

    useEffect(() => {
        generateDaysList(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const generateDaysList = (year, month) => {
        const daysInMonth = getDaysInMonth(new Date(year, month));
        const days = [];
        const daysToInclude = [0, 3, 6]; // Domingo (0), Quarta (3), Sábado (6)

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(year, month, i);
            if (daysToInclude.includes(currentDay.getDay())) {
                days.push({
                    day: i < 10 ? `0${i}` : i, // Adicionar zero se o dia for menor que 10
                    weekDay: format(currentDay, 'EEEE', { locale: ptBR }),
                    dayOfWeek: currentDay.getDay(),
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

    const getDayClass = (dayOfWeek) => {
        switch (dayOfWeek) {
            case 0: return 'domingo';
            case 3: return 'quarta';
            case 6: return 'sabado';
            default: return '';
        }
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
                        <div key={index} className={`dias-semana-item-list ${getDayClass(day.dayOfWeek)}`}>
                            <div className="avatar-quadrado">
                                {day.day}
                            </div>
                            <div className="dias-semana-item-container-name-day">
                                <ListItemText primary={day.weekDay.toUpperCase()} />
                            </div>
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
