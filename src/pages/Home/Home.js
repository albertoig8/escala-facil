// src/pages/Home/Home.js
import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import './styles.css';

const Home = () => {
  const categories = [
    { title: 'Sonoplastia', description: 'Escala para Sonoplastia', link: '/sonoplastia' },
    { title: 'Música', description: 'Escala para Música', link: '/musica' },
    { title: 'Mensageiros', description: 'Escala para Mensageiros', link: '/mensageiros' },
    { title: 'Recepção', description: 'Escala para Recepção', link: '/recepcao' }
  ];

  return (
    <div className="home-container">
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardActionArea href={category.link}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
