const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');

module.export = (req, res, next) => {
    const reqHeaders = req.headers('authorisation');

    if (!reqHeaders) {
        next();
    } else {
        const [token_type, jwt_token] = reqHeaders.split(' ');

        req.user = jwt.verify(jwt_token, secret);
        next();
    }
};
