const sendError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
    });
};

module.exports = (err, req, res) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    sendError(err, res);
};
