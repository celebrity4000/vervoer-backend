const fs = require('fs');
const Util = require('util');


const appendFile = Util.promisify(fs.appendFile);

const requestLogger = async (req, res, next) => {
    try {
        const logMessage = `${new Date()} - ${req.method} - ${req.url}`
        await appendFile('RequestLogger.log', logMessage);
        next()
    }
    catch (err) {
        next(err)
    }
}
module.exports = requestLogger;