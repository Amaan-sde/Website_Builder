const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('DATABASE Connected Successfully');
    } catch (err) {
        console.error('DATABASE Connection Failed:', err.message);
    }
};

module.exports = connectDb;