import { Router } from 'express';
import { Container } from 'typedi';
import ImportBrandsDTO from '../dtos/importBrandsDto';
import ImportPublisher from '../publishers/importPublisher';
const router = Router();

/**
 * TODO: Stub for import all
 */
router.post('/all', function (req, res) {
  res.send('Up and Running!');
});

/**
 * Import by brand
 */
router.post('/brands', function (req, res) {
  const importBrandsDTO = new ImportBrandsDTO(req.body);
  const importPublisher = Container.get(ImportPublisher);
  importPublisher.queueImportBrandsSequence(importBrandsDTO);
  // TODO: send email as well
  return res.status(202).end('Import is starting!');
});

export default router;
