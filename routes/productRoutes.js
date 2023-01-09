const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router.route('/').get(productController.getProducts);
router.route('/category').get(productController.getCategory);
router.route('/best-selling-product/:month/:week?').get(productController.getBestSelling);
router.route('/top-suggest').get(productController.topSuggest);
router.route('/product-sellers/:id').get(authController.protect, authController.restrictTo('admin'), productController.getProductSellers);
router.route('/cheapest-seller/:id').get(authController.protect, authController.restrictTo('admin'), productController.getCheapestSeller);
router.route('/product-comments/:id').get(productController.getComments);
router.route('/top3-comments/:id').get(productController.top3comments);
router.route('/worst3-comments/:id').get(productController.worst3comments);
router.route('/sell-amount/:id/:month').get(authController.protect, authController.restrictTo('admin'), productController.getSellAmount);
router.route('/avg-sell/:month').get(authController.protect, authController.restrictTo('admin'), productController.avgSell);
router.route('/supplier/:city').get(productController.getSuppliers);
router.route('/').post(authController.protect, authController.restrictTo('admin'), productController.addProduct);
router.route('/:id').patch(authController.protect, authController.restrictTo('admin'), productController.updateProduct);
router.route('/:id').delete(authController.protect, authController.restrictTo('admin'), productController.deleteProduct);

module.exports = router;
