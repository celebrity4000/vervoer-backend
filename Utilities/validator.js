exports.ValidateName = async (name) => {
    if (name.trim().length !== 0) {
        return true;
    }
    return false
};
