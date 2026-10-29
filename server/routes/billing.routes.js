const express = require('express');
const isAuth = require('../middleware/isAuth.js');
const billingCtrl = require('../controllers/billing.controller.js');

const billingRouter = express.Router();

billingRouter.get('/plans', billingCtrl.getPlans);
billingRouter.get('/usage', isAuth, billingCtrl.getUsage);
billingRouter.post('/create-order', isAuth, billingCtrl.createOrder);
billingRouter.post('/verify', isAuth, billingCtrl.verifyPayment);

module.exports = billingRouter;
