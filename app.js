import part from 'path';

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

//add routes here app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(message);
  res.status(status).json({message: message, data: data});
});

mongoose
  .connect('mongodb+srv://jonathanbruckman:Beauman23!@muscle-memory.6qkts.mongodb.net/')
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err))