require('dotenv').config();
const express = require('express');
const connectDb = require('./config/database.js');

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});