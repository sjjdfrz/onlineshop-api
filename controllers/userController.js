const connection = require("../models/model");
const AppError = require('../Utils/appError');


exports.getUsers = (req, res, next) => {

    const city = req.params.city;
    let query;

    if (city)
        query = `select name from users where city = '${city}' and role != 'admin'`;
    else
        query = `select name from users where role != 'admin'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            users: rows
        });
    });
};


exports.getOrders = (req, res, next) => {

    connection.query('select * from shopping_card', (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            orders: rows
        });
    });
};


exports.getTopTenUsers = (req, res, next) => {

    const month = req.params.month;
    const week = req.params.week;
    let query;

    if (week) {
        query = `select users.name
                 from users, shopping_card
                 where users.ID = shopping_card.user_ID and month(shopping_card.date) = '${month}' and
                 day(shopping_card.date) >=  '${week * 7 - 6}' and day(shopping_card.date) <= '${week * 7}'
                 order by shopping_card.total_price desc 
                 limit 10`;
    }
    else {
        query = `select users.name
                   from users, shopping_card
                   where users.ID = shopping_card.user_ID and month(shopping_card.date) = '${month}'
                   order by shopping_card.total_price desc 
                   limit 10`;
    }


    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            users: rows

        });
    });
};


exports.lastTenOrders = (req, res, next) => {

    const id = req.params.id;
    const query = `select *
                   from shopping_card, users
                   where shopping_card.user_ID = users.ID and users.ID = '${id}'
                   order by shopping_card.date desc
                   limit 10`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            orders: rows
        });
    });
};


exports.updateUser = (req, res, next) => {

    const id = req.params.id;

    let set_command = `set`;

    for (let x in req.body) {

        if (x === 'email' || x === 'password')
            set_command += ` profilePage.${x} = '${req.body[x]}',`;
        else
            set_command += ` users.${x} = '${req.body[x]}',`;
    }

    set_command = set_command.replace(/,\s*$/, "");

    const query = `update users, profilePage ${set_command} where users.ID = '${id}' and profilePage.user_ID = '${id}'`;

    connection.query(query, (err) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',

        });
    });
};