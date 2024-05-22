const express = require('express');
const routing = express.Router();
const user = require('../Controller/userController');

routing.all('*', user.inValid);
routing.get("parking/list", user.getParkingList);
routing.get("parking/detail", user.getParkingDetail);


module.exports = routing;
