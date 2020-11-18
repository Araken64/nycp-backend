import express from 'express';
import * as prisonersCtrl from '../controllers/prisoners';

const router = express.Router();

router.post('/', prisonersCtrl.createPrisoner);
router.get('/', prisonersCtrl.getAllPrisoners);

export default router;
