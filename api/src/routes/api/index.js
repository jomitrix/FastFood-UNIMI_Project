const express = require('express');
const router = express.Router();

// SUB-ROUTES
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/restaurant', require('./restaurant'));
router.use('/restaurant/dashboard', require('./dashboard'));
router.use('/feed', require('./feed'));
router.use('/swagger', require('./swagger'));

router.get('/', (req, res) => {
  res.send("API is working properly!");
});

module.exports = router;