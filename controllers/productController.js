const connection = require("../models/model");
const AppError = require('../Utils/appError');

exports.getProducts = (req, res) => {

    connection.query('select name from product', (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            product: rows
        });
    });
};


exports.getBestSelling = (req, res) => {

    month = req.params.month;
    week = req.params.week;
    let query;

    if (week) {
        query = `select shopping_card.product_name
                 from shopping_card
                 where month(shopping_card.date) = '${month}' and
                 day(shopping_card.date) >=  '${((week - 1) * 7) + 1}' and day(shopping_card.date) <= '${week * 7}'
                 order by shopping_card.total_price desc 
                 limit 5`;
    } else {
        query = `select shopping_card.product_name
                 from shopping_card
                 where month(shopping_card.date) = '${month}'    
                 order by shopping_card.total_price desc 
                 limit 5`;
    }


    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            products: rows

        });
    });
};


exports.topSuggest = (req, res) => {

    connection.query(`select name, amount
                      from discount, product
                      where discount.product_ID = product.ID and discount.amount > 15
                      order by amount desc`, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            suggests: rows
        });
    });
};


exports.getProductSellers = (req, res) => {

    id = req.params.id;


    const query = `select supplier.name
                   from product, supplier, product_has_supplier
                   where product.ID = product_has_supplier.product_ID and product_has_supplier.supplier_ID = supplier.ID and product.ID = '${id}'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            sellers: rows

        });
    });
};


exports.getCheapestSeller = (req, res) => {

    id = req.params.id;


    const query = `select supplier.name
                   from product, supplier, product_has_supplier, bill
                   where product.ID = product_has_supplier.product_ID and product_has_supplier.supplier_ID = supplier.ID and product.ID = '${id}'
                   order by bill.total_price / bill.count
                   limit 1`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            seller: rows

        });
    });
};


exports.getComments = (req, res) => {

    const id = req.params.id;
    const query = `select comment.description as description, comment.score as score
                   from comment, product
                   where comment.product_ID = product.ID and product.ID = '${id}'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            comments: rows
        });
    });
};


exports.top3comments = (req, res) => {

    const id = req.params.id;
    const query = `select comment.description as description, comment.score as score
                   from comment, product
                   where comment.product_ID = product.ID and product.ID = '${id}'
                   order by comment.score desc
                   limit 3`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            comments: rows
        });
    });
};


exports.worst3comments = (req, res) => {

    const id = req.params.id;
    const query = `select comment.description as description, comment.score as score
                   from comment, product
                   where comment.product_ID = product.ID and product.ID = '${id}'
                   order by comment.score
                   limit 3`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            comments: rows
        });
    });
};


exports.getCategory = (req, res) => {

    connection.query('select distinct category from product', (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            categories: rows
        });
    });
};


exports.getSellAmount = (req, res) => {

    month = req.params.month;
    id = req.params.id;

    const query = `select product.name, sum(shopping_card.total_price) as sell_amount
                   from product, shopping_card_has_product, shopping_card
                   where product.ID = shopping_card_has_product.product_ID and
                   shopping_card_has_product.order_no = shopping_card.order_no and
                   product.ID = '${id}' and month(shopping_card.date) = '${month}'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            sellAmount: rows

        });
    });
};


exports.avgSell = (req, res) => {

    month = req.params.month;

    const query = `select avg(shopping_card.total_price) as avgSell
                   from shopping_card
                   where month(shopping_card.date) = '${month}'`;

    connection.query(query, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            avgSell: rows

        });
    });
};


exports.getSuppliers = (req, res) => {

    const city = req.params.city;

    connection.query(`select name from supplier where city = '${city}'`, (err, rows) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',
            suppliers: rows
        });
    });
};


exports.addProduct = (req, res, next) => {

    let values = ``;
    let column = ``;

    for (x in req.body) {

        if (x === "ID" || x === "price") {
            values += `${req.body[x]},`;
            column += `${x},`;
        } else {
            values += `'${req.body[x]}',`;
            column += `${x},`;
        }
    }

    values = values.replace(/,\s*$/, "");
    column = column.replace(/,\s*$/, "");

    const query = `insert into product(${column}) values(${values})`;

    connection.query(query, (err) => {
        if (err)
            return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',

        });
    });
};


exports.updateProduct = (req, res) => {

    id = req.params.id;

    let set_command = `set`;

    for (x in req.body)
        set_command += ` ${x} = '${req.body[x]}',`;


    set_command = set_command.replace(/,\s*$/, "");

    const query = `update product ${set_command} where product.ID = '${id}'`;

    connection.query(query, (err) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',

        });
    });
};


exports.deleteProduct = (req, res) => {

    id = req.params.id;

    const query = `delete from product where product.ID = '${id}'`;

    connection.query(query, (err) => {
        if (err) return next(new AppError(`sqlMessage: ${err.sqlMessage}`, 400));

        res.status(200).json({
            status: 'successful',

        });
    });
};