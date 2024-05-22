const express = require('express');
const middleware = require("../Middleware/fun");
const routing = express.Router();
const merchant = require('../Controller/merchantController');
const upload = require("../Middleware/multer");

 routing.post("/parking/add",
 middleware.authenticateToken,
 merchant.parkingAdd,
 );
 routing.patch("/parking/update",
 middleware.authenticateToken,
 upload.fields([{name: 'parkingImage', maxCounts:3}]),
 merchant.updateParking,
 );
//  routing.put('/parking/about',middleware.authenticateToken, merchant.updateAbout)
//  routing.put('/parking/contact',middleware.authenticateToken, merchant.updateParkingContactInfo)
//  routing.put('/parking/price',middleware.authenticateToken, merchant.updateParkingPrice)
//  routing.put('/parking/address',middleware.authenticateToken, merchant.updateParkingAddress)
 routing.post('/parking/zone/add',middleware.authenticateToken, merchant.addParkingZone)
 routing.get('/parking/list/get', middleware.authenticateToken, merchant.getParkingList)
 routing.post('/parking/zone/update',middleware.authenticateToken, merchant.updateParkingZone)
 routing.put('/parking/availability/update',middleware.authenticateToken, merchant.updateParkingAvailability)

 //Dry Cleaning
//  routing.post("/drycleaning/add",
//  middleware.authenticateToken,
//  merchant.addDrycleaning,
//  );
 
module.exports = routing;
