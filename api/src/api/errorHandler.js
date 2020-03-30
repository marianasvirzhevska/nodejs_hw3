function errorHandler(message, res, err, code=500) {
    if (err) {
        console.error(err);
    }

    res.status(code).json({ status: message });
    res.end();
};

module.exports = errorHandler;
