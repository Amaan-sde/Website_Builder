require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database.js');
const authRouter = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.use(express.json())
app.use('/api/auth')
app.use(cookieParser());

app.cors({
    origin: 'http:localhost:5173',
    Credential: true,
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});

