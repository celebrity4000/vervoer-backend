
const codeGenerator = require("generate-otp");
const fast2sms = require("fast-two-sms");
const { FAST2SMS } = require("../Config/config");

exports.otpGenerator = (code_length) => {
    return codeGenerator.generate(code_length, {
        numbers: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
    });
};

exports.fast2sms = async ({ message, contactNumber }, next) => {
    try {
        var options = { authorization: FAST2SMS, message: message, numbers: [contactNumber] };
        console.log(options);
        const res = await fast2sms.sendMessage(options);
        console.log("res------>", res)
        next
    } catch (error) {
        next(error);
    }
};