const express = require('express');
const Container = require('typedi').Container;
const ImportBrandsDTO = require('../dto/importBrandsDto');
const ImportPublisher = require('../publisher/importPublisher');
const router = express.Router();

/**
 * TODO: Stub for import all
 */
router.post('/all', function(req, res) {
  res.send('Up and Running!');
});

/**
 * Import by brand
 */
router.post('/brands', function(req, res, next) {
  const importBrandsDTO = new ImportBrandsDTO(req.body).toJSON();
  const importPublisher = Container.get(ImportPublisher);
  importPublisher.queueImportBrandsSequence(importBrandsDTO);
  // TODO: send email as well
  return res.status(200).end('Import is starting!');
});

module.exports = router;
