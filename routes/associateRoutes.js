const express = require('express');
const router = express.Router();
const { registerAssociate, loginAssociate } = require('../controllers/associateController');

// Register associate route
router.post('/register', registerAssociate);

// Login associate route
router.post('/login', loginAssociate);

module.exports = router;
