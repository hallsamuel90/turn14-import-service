const express = require('express');
const Container = require('typedi').Container;
const ImportService = require('../service/import');
const CredentialsDTO = require('../dto/credentialsDto');
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
router.post('/:brand', function(req, res, next) {
  // inject service
  const importService = Container.get(ImportService);

  const credentialsDTO = new CredentialsDTO(req.body).toJSON();
  try {
    if (importService.validateCredentials(credentialsDTO)) {
      // kick off async import job
      // send email that import is starting (rabbitmq => notifier service?)
      return res.status(200).end('Import is starting!');
    } else {
      return res.status(401).end('Not authorized!');
    }
  } catch (e) {
    console.error('🔥 error: %o', e );
    return next(e);
  }
});

module.exports = router;
