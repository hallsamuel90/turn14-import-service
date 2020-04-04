import { Router } from 'express';
const router = Router();

router.get('/health', function (req, res) {
  res.send('Up and Running!');
});

export default router;
