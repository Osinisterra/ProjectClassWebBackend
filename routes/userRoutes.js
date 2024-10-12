const express = require('express');
const { registerUser, loginUser, deactivateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/deactivate/:id', deactivateUser);

module.exports = router;