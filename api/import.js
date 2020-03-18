const express = require('express');
const Container = require('typedi').Container;
const ImportService = require('../service/import');
const router = express.Router();

/**
 * TODO: Stub for import all
 */
router.post('/', function(req, res) {
  res.send('Up and Running!');
});

/**
 * Import by brand
 */
router.post('/:brand', function(req, res) {
  const importService = Container.get(ImportService);
  res.send(importService.test());
});

module.exports = router;
