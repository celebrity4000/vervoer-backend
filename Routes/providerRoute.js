const express = require('express');
const routing = express.Router();
const provider = require('../Controller/providerController');

routing.all('*', provider.inValid);

module.exports = routing;
