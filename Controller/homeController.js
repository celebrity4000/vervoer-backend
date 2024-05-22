const db = require('../DB/db');
const DryCleaning = require('../Model/Drycleaning');
const Auth = require('../Model/Auth');
const dryCleanerBooking = require('../Model/dryCleanerBooking');
const Parking = require('../Model/Parking');
const parkingSpace = require('../Model/parkingSpace');
const parkingCarSpot = require('../Model/parkingCarSpot');
const ParkingBooking = require('../Model/ParkingBooking');

exports.inValid = async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid Path'
    })
}

exports.countryList = async (req, res) => {
    const countr = "US";
    try {
        const country_list = await db.collection('countries').find({
            code: countr
        }).toArray();
        res.status(200).send(country_list);
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.stateList = async (req, res) => {
    try {
        const country = req.query.country;
        if (!country) {
            return res.status(400).json({
                status: 'fail',
                message: 'Country is required'
            })
        }
        const state_list = db.collection('states').find({ country: country });
        let list = [];
        for await (const doc of state_list) {
            list.push(doc);
        }
        res.status(200).send(list);
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.cityList = async (req, res) => {
    const country = req.query.country;
    const state = req.query.state;
    if (!country) {
        return res.status(400).json({
            status: 'fail',
            message: 'Country is required'
        })
    }
    if (!state) {
        return res.status(400).json({
            status: 'fail',
            message: 'State is required'
        })
    }
    const city_list = db.collection('cities').find({ country: country, state: state });
    let list = [];
    for await (const doc of city_list) {
        list.push(doc);
    }
    res.status(200).send(list);
}

exports.dayList = async (req, res) => {
    res.status(200).json([
        {
            daySlug: 'sunday',
            dayName: 'Sunday',
        },
        {
            daySlug: 'monday',
            dayName: 'Monday',
        },
        {
            daySlug: 'tuesday',
            dayName: 'Tuesday',
        },
        {
            daySlug: 'wednesday',
            dayName: 'Wednesday',
        },
        {
            daySlug: 'thursday',
            dayName: 'Thursday',
        },
        {
            daySlug: 'friday',
            dayName: 'Friday',
        },
        {
            daySlug: 'saturday',
            dayName: 'Saturday',
        }
    ])
}

exports.timeList = async (req, res) => {
    res.status(200).json([
        {
            time24H: '4:00',
            time12H: '4:00 AM',
        },
        {
            time24H: '5:00',
            time12H: '5:00 AM',
        },
        {
            time24H: '6:00',
            time12H: '6:00 AM',
        },
        {
            time24H: '7:00',
            time12H: '7:00 AM',
        },
        {
            time24H: '8:00',
            time12H: '8:00 AM',
        },
        {
            time24H: '9:00',
            time12H: '9:00 AM',
        },
        {
            time24H: '10:00',
            time12H: '10:00 AM',
        },
        {
            time24H: '11:00',
            time12H: '11:00 AM',
        },
        {
            time24H: '12:00',
            time12H: '12:00 PM',
        },
        {
            time24H: '13:00',
            time12H: '1:00 PM',
        },
        {
            time24H: '14:00',
            time12H: '2:00 PM',
        },
        {
            time24H: '15:00',
            time12H: '3:00 PM',
        },
        {
            time24H: '16:00',
            time12H: '4:00 PM',
        },
        {
            time24H: '17:00',
            time12H: '5:00 PM',
        },
        {
            time24H: '18:00',
            time12H: '6:00 PM',
        },
        {
            time24H: '19:00',
            time12H: '7:00 PM',
        },
        {
            time24H: '20:00',
            time12H: '8:00 PM',
        },
        {
            time24H: '21:00',
            time12H: '9:00 PM',
        },
        {
            time24H: '22:00',
            time12H: '10:00 PM',
        },
        {
            time24H: '23:00',
            time12H: '11:00 PM',
        },
        {
            time24H: '24:00',
            time12H: '12:00 AM',
        }
    ])
}

exports.acceptItemList = async (req, res) => {
    res.status(200).json([
        {
            itemSlug: 'blouse',
            itemName: 'Blouse ',
        },
        {
            itemSlug: 'shirt',
            itemName: 'Shirt',
        },
        {
            itemSlug: 'jeans',
            itemName: 'Jeans',
        },
        {
            itemSlug: 't_shirt',
            itemName: 'T-Shirt',
        },
        {
            itemSlug: 'blanket',
            itemName: 'Blanket',
        },
        {
            itemSlug: 'dress',
            itemName: 'Dress',
        },
        {
            itemSlug: 'gloves',
            itemName: 'Gloves',
        },
        {
            itemSlug: 'suit',
            itemName: 'Suit',
        },
        {
            itemSlug: 'tie',
            itemName: 'Tie',
        },
        {
            itemSlug: 'scarf',
            itemName: 'Scarf',
        },
        {
            itemSlug: 'sweater',
            itemName: 'Sweater',
        },
        {
            itemSlug: 'skirt',
            itemName: 'Skirt',
        },
        {
            itemSlug: 'coat',
            itemName: 'Coat',
        },
        {
            itemSlug: 'rug',
            itemName: 'Rug',
        },
    ])
}

exports.starchLevel = async (req, res) => {
    res.status(200).json([
        {
            itemSlug: 'light'
        },
        {
            itemSlug: 'medium'
        },
        {
            itemSlug: 'heavy'
        }
    ])
}

exports.truncateAllTable = async (req, res) => {
    // Auth.collection.remove();
    // DryCleaning.collection.remove();
    // dryCleanerBooking.collection.remove();

    // Parking.collection.remove();
    // parkingSpace.collection.remove();
    // parkingCarSpot.collection.remove();

    ParkingBooking.collection.remove();

    return res.status(200).json({
        success: true,
        msg: "All table truncated"
    });
}