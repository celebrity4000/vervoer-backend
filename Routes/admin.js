const express = require('express');
const API_ROUTER = express.Router();
const Middleware = require('../Middleware/admin');

/** Controllers declaration */
const AUTH = require('../Controller/admin/authController');
const USER = require('../Controller/admin/userController');
const COUNTRY = require('../Controller/admin/countryController');
/** Controllers declaration end */

/** Routing Start */
API_ROUTER.get('/', function (req, resp, next) { resp.send("Admin routs are ready to use") });
API_ROUTER.post('/signup', AUTH.signup);
API_ROUTER.post('/login', AUTH.login);

//*? *********************************** Authorize routs start here ***********************************
API_ROUTER.get('/my-profile', Middleware.authenticateToken, AUTH.getMyProfile);

API_ROUTER.get('/user-list', Middleware.authenticateToken, USER.listUser);
API_ROUTER.post('/user-block-unblock', Middleware.authenticateToken, USER.userBlockUnBlock);
API_ROUTER.post('/user-delete', Middleware.authenticateToken, USER.deleteUser);

API_ROUTER.post('/save-pincode-data', Middleware.authenticateToken, COUNTRY.savePinCodeData);
API_ROUTER.get('/country-list', Middleware.authenticateToken, COUNTRY.countryList);
API_ROUTER.get('/state-list', Middleware.authenticateToken, COUNTRY.stateList);
API_ROUTER.get('/city-list', Middleware.authenticateToken, COUNTRY.cityList);
API_ROUTER.get('/pincode-list', Middleware.authenticateToken, COUNTRY.pinCodeList);
API_ROUTER.post('/delete-pincode', Middleware.authenticateToken, COUNTRY.deletePinCode);
/** Routing End */
module.exports = API_ROUTER;