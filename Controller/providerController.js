const Auth = require('../Model/Auth');
const Validator = require('../Utilities/validator');
const helper = require('../Utilities/helpers');
  

exports.inValid = async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid Path'
    })
}