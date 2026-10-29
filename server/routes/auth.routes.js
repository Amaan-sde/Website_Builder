const express = require('express');
const { googleAuth, logout, demoAuth } = require('../controllers/auth.controller.js');

const authRouter = express.Router();

authRouter.post('/google', googleAuth);
authRouter.post('/demo', demoAuth);
authRouter.get('/logout', logout);

module.exports = authRouter;