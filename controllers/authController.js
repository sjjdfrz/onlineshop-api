const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
const connection = require("../models/model");


JWT_SECRET = 'secure-ultra-and-long-secret';
JWT_EXPIRES_IN = 90;

// create token
const signToken = id => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    });
};

// send token and save on cookie
const createSendToken = (id, statusCode, res) => {
    const token = signToken(id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token
    });
};


exports.signup = (req, res, next) => {

    let values1 = ``;
    let column1 = ``;
    let values2 = ``;
    let column2 = ``;

    for (let x in req.body) {

        if (x === "email" || x === "password") {
            values2 += `${req.body[x]},`;
            column2 += `${x},`;
        } else {

            if (x === "ID" || x === "zip_code") {
                values1 += `${req.body[x]},`;
                column1 += `${x},`;
            } else {
                values1 += `'${req.body[x]}',`;
                column1 += `${x},`;
            }
        }
    }
    values2 += `${req.body.ID}`;
    column2 += `ID`;
    values1 = values1.replace(/,\s*$/, "");
    column1 = column1.replace(/,\s*$/, "");

    const query = `insert into users(${column1}) values(${values1});insert into profilepage(${column2}) values(${values2})`;

    connection.query(query, (err) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        createSendToken(req.body.ID, 201, res);
    });
};


exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return next(new AppError('Please provide email and password!', 400));


    const query = `select * from profilepage where email = '${email}' and password = '${password}'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        if (rows.length === 0)
            return next(new AppError('Incorrect email or password', 401));

        createSendToken(rows[0].user_ID, 201, res);
    });
};


exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({status: 'successful'});
};


exports.protect = async (req, res, next) => {

    try {
        // 1) Getting token and check of it's there
        let token;
        let currentUser;

        if (req.cookies.jwt)
            token = req.cookies.jwt;

        if (!token)
            return next(new AppError('You are not logged in! Please log in to get access.', 401));


        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

        // 3) Check if user still exists
        const query = `select * from users where ID = '${decoded.id}'`;

        connection.query(query, (err, rows) => {
            if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

            if (rows.length === 0)
                return next(new AppError('The user belonging to this token does no longer exist.', 401));

            currentUser = rows[0];
            req.user = currentUser;
            next();
        });
    } catch (err) {
        next(err);
    }


};

exports.restrictTo = (roles) => {
    return (req, res, next) => {

        if (roles.localeCompare(req.user.role) === -1)
            return next(new AppError('You do not have permission to perform this action', 403));

        next();
    };
};