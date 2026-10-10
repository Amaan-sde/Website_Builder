const express = require('express');
const { getCurrentUser } = require('../controllers/user.controller.js');
const { default: isAuth } = require('../middleware/isAuth.js');

const userRouter = express.Router();



userRouter.get('/me', isAuth, getCurrentUser)

module.exports = userRouter;