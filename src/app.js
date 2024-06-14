const express = require("express");

const app = express();

const userRouter = require('./routes/userRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to my E-commerce app');
});

app.use('/user', userRouter);

module.exports = app;