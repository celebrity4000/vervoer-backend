const Validator = require('../Utilities/validator');
const {otpGenerator} = require("../Utilities/helpers");
const Parking = require('../Model/Parking');
// const turf = require('@turf/distance');
exports.inValid = async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid Path'
    })
}
exports.getParkingList = async (req, res) => {
    try {
      let { longitude, latitude } = req.body;
      //convert miles to radian 3963.2
      let miles = 100;
      let earthRadiusInMiles = 3963.2;
      let milesToRadian = miles / earthRadiusInMiles;
      let query = 
      { 
        coordinates: {
          $geoWithin: {
            $centerSphere: [
              [longitude,latitude], milesToRadian
            ] // first parameter should be array of string comman seperated(Cordinates) and second parameter radian 
          }
        },
        status: true,
        isApproved: true,
        isDeleted: false,
      };
      let parkingList =  await Parking.find(query).lean();
      const address = await geocoder.reverse({lon:longitude , lat: latitude}, (err, resp) => {
      });
      if(!parkingList) return res.status(404).json({msg: 'No parking found'});
      
      return res.status(200).json({
        success: true,
        data: { parkingList },
      });
    } 
    
    catch (error) {
      winston.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

  exports.getParkingDetail = async (req, res) => {
    try {
      const { parkingId } = req.body;
      const parking = await Parking.findById({_id: parkingId}).populate({path: 'merchantId'}).lean();
      if(!parking) return res.status(404).json({msg: 'Not found'})
  
      return res.status(200).json({
        success: true,
        data: { parking },
      });
    } catch (error) {
      winston.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

  exports.createBooking = async (req, res) => {
    try {
       const user = await Auth.findOne({_id: req.data.id});
       if (!user) return res.status(404).json({ error: "User not found" });
  
      const bookingDetails = new Booking({
        userId: req.data.id,
        parkingId: req.body.parkingId,
        duration: req.body.duration,
        date: moment(req.body.date).format("MMM DD, YYYY"),
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        paymentAmount: req.body.paymentAmount,
        isFeePaid: req.body.isFeePaid,
        status: "sent",
      });
  
      bookingDetails.populate('walkerId').execPopulate();
      const save = await bookingDetails.save();
      // send notification to walker
  
      let notification_data = {
        name: `${owner.basicInfo.fullName}`,
        date: moment(req.body.date).format("MMM DD, YYYY"),
        startTime: req.body.startTime,
      };
  
      let { title, body } = notificationTypes.addBooking(
        notification_data
      );
  
      let data = {
        senderId: req.data.id,
        receiverId: req.body.walkerId,
        notificationSendTo: "walker",
        title,
        body,
      };
  
      sendNotification(data);
  
      return res.status(200).json({
        success: true,
        msg: "Service Booked",
        data: { details: save },
      });
    } catch (error) {
      winston.error(error);
    }
  };