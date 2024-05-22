const express = require("express");
const API_ROUTER = express.Router();
const Middleware = require("../Middleware/fun");

/** Controllers declaration */
const HOME = require("../Controller/homeController");
const AUTH = require("../Controller/registerController");
const DRY_CLEANER = require("../Controller/dryCleanerController");
const PARKING = require("../Controller/api/parkingController");
const PAYMENT = require("../Controller/paymentController");
const DELIVERY = require("../Controller/deliveryBoyController");
/** Controllers declaration end */

/** Routing Start */
API_ROUTER.get("/", function (req, resp, next) {
  resp.send("Api routs are ready to use");
});
API_ROUTER.post("/signup", AUTH.signup);
API_ROUTER.post("/login", AUTH.login);
API_ROUTER.post("/resetpassword", AUTH.resetPassword);
API_ROUTER.get(
  "/get-my-profile",
  Middleware.authenticateToken,
  AUTH.getMyProfile
);

API_ROUTER.get("/get-all-profile", AUTH.getAllUsers);

API_ROUTER.post(
  "/update-my-profile",
  Middleware.authenticateToken,
  AUTH.updateMyProfile
);
API_ROUTER.post(
  "/update-profile-image",
  Middleware.authenticateToken,
  AUTH.updateMyProfileImage
);
API_ROUTER.post(
  "/user-file-upload",
  Middleware.authenticateToken,
  AUTH.userFileUpload
);

////////////////////////////////////////////////
API_ROUTER.post(
  "/stripe/create-checkout-session",
  Middleware.authenticateToken,
  PAYMENT.checkout_session
);
API_ROUTER.post("/webhooks", PAYMENT.payment_intent_webhooks);
API_ROUTER.post(
  "/complete-order",
  Middleware.authenticateToken,
  PAYMENT.update_payment_details_after_webhook
);
API_ROUTER.get(
  "/get_all_otps",
  Middleware.authenticateToken,
  PAYMENT.get_all_otps
);
///////////////////////////////////////////////

////////////////deilvery boy////////////////////
API_ROUTER.post("/delivery/create-delivery", DELIVERY.bookingDeliveryBoy);
API_ROUTER.post(
  "/delivery/fetch-delivery-orderid",
  DELIVERY.fetchDeliveryByByOrderId
);
API_ROUTER.post("/delivery/fetch-delivery-all", DELIVERY.fetchDelivery);
API_ROUTER.post(
  "/delivery/fetch-delivery-assignto",
  DELIVERY.fetchDeliveryByByUserId
);
API_ROUTER.post(
  "/delivery/accept-delivery",
  DELIVERY.updateDeliveryAcceptingStatus
);
API_ROUTER.post(
  "/delivery/reject-delivery",
  DELIVERY.updateDeliveryRejectingStatus
);
//////////////////////////////////////////////

API_ROUTER.get(
  "/get-my-dry-cleaner-profile",
  Middleware.authenticateToken,
  DRY_CLEANER.dryCleanerData
);
API_ROUTER.post(
  "/update-my-dry-cleaner-profile",
  Middleware.authenticateToken,
  DRY_CLEANER.updateDryCleanerProfile
);
API_ROUTER.get(
  "/search-dry-cleaner",
  Middleware.authenticateToken,
  DRY_CLEANER.searchDryCleaner
);
API_ROUTER.post(
  "/booking/dry-cleaner",
  Middleware.authenticateToken,
  DRY_CLEANER.myDryCleanerBooking
);
API_ROUTER.get(
  "/dry-cleaner/orders",
  Middleware.authenticateToken,
  DRY_CLEANER.dryCleanerOrders
);
API_ROUTER.get(
  "/dry-clean-booking/:id",
  Middleware.authenticateToken,
  DRY_CLEANER.dryCleanBooking
);

//////////////////////////////////
API_ROUTER.get(
  "/users/orders",
  Middleware.authenticateToken,
  DRY_CLEANER.usersOrders
);
////////////////////////////////

API_ROUTER.post(
  "/order/confirm",
  Middleware.authenticateToken,
  DRY_CLEANER.acceptDryCleaningOrder
);
API_ROUTER.post(
  "/order/cancel",
  Middleware.authenticateToken,
  DRY_CLEANER.cancelDryCleaningOrder
);

API_ROUTER.get(
  "/get-parking-data",
  Middleware.authenticateToken,
  PARKING.getParkingData
);
API_ROUTER.post(
  "/register-parking",
  Middleware.authenticateToken,
  PARKING.registerParking
);
//// API_ROUTER.post('/save-parking-space-count', Middleware.authenticateToken, PARKING.parkingSpaceGenerate);
API_ROUTER.get(
  "/parking-space-list",
  Middleware.authenticateToken,
  PARKING.parkingSpaceList
);
//// API_ROUTER.post('/parking-space-price-update', Middleware.authenticateToken, PARKING.parkingSpacePriceUpdate);
API_ROUTER.post(
  "/save-parking-space-car-count",
  Middleware.authenticateToken,
  PARKING.parkingCarSpaceGenerate
);
API_ROUTER.get(
  "/car-spot-list",
  Middleware.authenticateToken,
  PARKING.carSpotList
);
API_ROUTER.post(
  "/active-inactive-parking-space",
  Middleware.authenticateToken,
  PARKING.activeInactiveParkingSpace
);
API_ROUTER.post(
  "/active-inactive-car-spot",
  Middleware.authenticateToken,
  PARKING.activeInactiveCarSpot
);
API_ROUTER.post(
  "/create-new-parking-space",
  Middleware.authenticateToken,
  PARKING.createNewParkingSpace
);
API_ROUTER.post(
  "/create-new-car-space",
  Middleware.authenticateToken,
  PARKING.createNewCarSpace
);

API_ROUTER.get(
  "/search-parking-spot",
  Middleware.authenticateToken,
  PARKING.searchParkingSpot
);
API_ROUTER.get(
  "/view-parking",
  Middleware.authenticateToken,
  PARKING.viewParking
);
API_ROUTER.post(
  "/book-parking-spot",
  Middleware.authenticateToken,
  PARKING.bookParkingSpot
);
API_ROUTER.get(
  "/list-booked-parkings",
  Middleware.authenticateToken,
  PARKING.listBookedParkings
);
API_ROUTER.post(
  "/release-spot",
  Middleware.authenticateToken,
  PARKING.releaseBookingSpot
);

API_ROUTER.get("/country-list", HOME.countryList);
API_ROUTER.get("/state-list", HOME.stateList);
API_ROUTER.get("/city-list", HOME.cityList);
API_ROUTER.get("/day-list", HOME.dayList);
API_ROUTER.get("/time-list", HOME.timeList);
API_ROUTER.get("/accept-item-list", HOME.acceptItemList);
API_ROUTER.get("/starch-level", HOME.starchLevel);
API_ROUTER.get("/empty-table", HOME.truncateAllTable);
/** Routing End */
API_ROUTER.all("*", HOME.inValid);
module.exports = API_ROUTER;
