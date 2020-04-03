const {
    findUserById,
} = require('../models/userModel');
const errorHandler = require('../api/errorHandler');
const { USER_ROLE } = require('../constants');

function validateDriver(user, res) {
    if (!user) {
        errorHandler('Invalid user token.', res, null, 403);
        return false;
    }

    if (role !== USER_ROLE.DRIVER) {
        errorHandler('Action not permitted.', res, null, 403);
        return false;
    }

    return true;

    findUserById(id)
        .then((dbDriver) => {
            valid = true;

            const { assigned_load: assignedLoad } = dbDriver;

            if (assignedLoad) {
                permition = false;
                res.json({ status: 'Driver is on a way. Action not permitted.' });
            } else {
                permition = true;
            }
        })
        .catch((err) => err);

    return {
        valid,
        permition,
    };
};


module.exports = validateDriver;
