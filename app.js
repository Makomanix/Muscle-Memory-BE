const https = require('https');
const fs = require('fs');
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
const HTTPS_CERT = process.env.HTTPS_CERT;
const HTTPS_KEY = process.env.HTTPS_KEY;


const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, HTTPS_KEY)),
  cert: fs.readFileSync(path.resolve(__dirname, HTTPS_CERT))
}

const server = https.createServer(httpsOptions, app);

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
  
  //setting headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://api.mm.local:5173');
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
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  // console.log('status', status);
  // console.log('error 123', error);
  // console.log('data', data);
  // console.log('message', message);
  const details = data?.map((detail) => {
    return detail.msg;
  })
  // console.log("details", details);
  res.status(status).json({message: message, details: details, data: data});
});

//server connection
mongoose
  .connect(DB_CONNECTION_STRING)
  .then(() => {
    server.listen(8080, () => {
      console.log('Secure server running on https://api.mm.local:8080')
    });
  })
  .catch(err => console.log(err))