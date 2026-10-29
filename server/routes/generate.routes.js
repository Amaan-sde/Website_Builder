const express = require('express');
const isAuth = require('../middleware/isAuth.js');
const generateCtrl = require('../controllers/generate.controller.js');

const generateRouter = express.Router();

generateRouter.use(isAuth);

generateRouter.post('/website', generateCtrl.generate);
generateRouter.post('/chat', generateCtrl.chat);
generateRouter.get('/conversation/:projectId', generateCtrl.getConversation);

module.exports = generateRouter;
