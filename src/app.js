const express = require('express');
const morgan = require('morgan')

const app = express();

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

const logger = require('./config/logger');
const setupSwagger = require('./swagger');

app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))

app.get('/', (req, res) => {
    res.send('Welcome to my E-commerce app');
});

app.use('/user', userRouter);
app.use('/login', authRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

setupSwagger(app);

module.exports = app;