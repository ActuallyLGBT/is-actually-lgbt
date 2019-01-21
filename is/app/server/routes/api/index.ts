import * as express from 'express';

const router = express.Router();

router.get('/', (_, res) => res.json({ ok: true }));
router.get('/data', async (_, res) => res.json({ result: 'foo' }));

export default router;
