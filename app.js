const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth')
const exerciseRoutes = require('./routes/exercise.js');
const workoutRoutes = require('./routes/workout.js');

const app = express();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

//setting headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

//add routes here app.use('/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/workouts', workoutRoutes);

//error collection 
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(message);
  res.status(status).json({message: message, data: data});
});

//server connection
mongoose
  .connect(DB_CONNECTION_STRING)
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err))