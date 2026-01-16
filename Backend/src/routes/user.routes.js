const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// All routes are protected and admin only
router.use(protect);
router.use(adminOnly);

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
