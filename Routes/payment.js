const express = require('express');
const API_ROUTER = express.Router();


const PAYMENT = require('../Controller/paymentController')


API_ROUTER.post('/make-payment', PAYMENT.payment);