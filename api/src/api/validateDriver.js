const errorHandler = require('../api/errorHandler');
const { USER_ROLE } = require('../constants');

function validateDriver(user, res) {
    if (!user) {
        errorHandler('Invalid user token.', res, null, 403);
        return false;
    }

    if (user.role !== USER_ROLE.DRIVER) {
        errorHandler('Action not permitted.', res, null, 403);
        return false;
    } else {
        return true;
    }
};

module.exports = validateDriver;
