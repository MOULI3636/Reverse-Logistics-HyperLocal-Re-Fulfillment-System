const express = require('express');
const router = express.Router();
const { runDemo } = require('../controllers/demoController');

router.post('/run', runDemo);

module.exports = router;
