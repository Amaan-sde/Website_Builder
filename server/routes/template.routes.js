const express = require('express');
const templateCtrl = require('../controllers/template.controller.js');

const templateRouter = express.Router();

templateRouter.get('/', templateCtrl.listTemplates);
templateRouter.get('/:id', templateCtrl.getTemplate);

module.exports = templateRouter;
