const express = require('express');
const router = express.Router();

router.get('/health', function(req, res) {
  res.send('Up and Running!');
});

module.exports = router;
