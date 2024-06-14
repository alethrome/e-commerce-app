const express = require("express");

const app = express();

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to my E-commerce app');
});

app.use('/user', userRouter);
app.use('/login', authRouter);

module.exports = app;