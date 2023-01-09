const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/:city?').get(authController.protect, userController.getUsers);
router.route('/orders').get(authController.protect, userController.getOrders);
router.route('/top-ten-users/:month/:week?').get(authController.protect, userController.getTopTenUsers);
router.route('/last-ten-orders/:id').get(authController.protect, userController.lastTenOrders);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/signup').post(authController.signup);
router.route('/:id').patch(authController.protect, userController.updateUser);

module.exports = router;