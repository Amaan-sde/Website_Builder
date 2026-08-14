const express = require('express')
const { googleAuth } = require('../controllers/user.controller.js');
const { logout } = require('../controllers/user.controller.js')

const authRouter = express.Router();


authRouter.post('/google', googleAuth)
authRouter.get('/logout', logout)

export default authRouter