const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');

module.exports = (req, res, next) => {
    const reqHeaders = req.headers['authorization'];

    if (!reqHeaders) {
        next();
    } else {
        // JWT auiwgwjhfgioajoij
        const [token_type, jwt_token] = reqHeaders.split(' ');

        req.user = jwt.verify(jwt_token, secret);

        next();
    }
};
