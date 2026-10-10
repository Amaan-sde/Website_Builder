require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database.js');
const authRouter = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});

