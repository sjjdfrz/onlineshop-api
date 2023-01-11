const connection = require("../models/model");
const AppError = require('../Utils/appError');


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