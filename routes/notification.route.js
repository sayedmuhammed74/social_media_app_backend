const { Router } = require('express');
const router = Router();
// Controllers
const { protect } = require('../controllers/authController');
const {
  getAllNotifications,
  addNotification,
  removeNotification,
  readNotification,
} = require('../controllers/notification.controller');

// Protect Routes
router.use(protect);

router.route('/').get(getAllNotifications).post(addNotification);

router.route('/:notificationId').get(readNotification).post(removeNotification);

module.exports = router;
