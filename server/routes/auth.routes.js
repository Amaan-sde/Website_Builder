const express = require('express')
const { googleAuth } = require('../controllers/auth.controller.js');
const { logout } = require('../controllers/auth.controller.js')

const authRouter = express.Router();


authRouter.post('/google', googleAuth)
authRouter.get('/logout', logout)

module.exports = authRouter;