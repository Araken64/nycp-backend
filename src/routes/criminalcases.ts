import express from 'express';
import * as casesCtrl from '../controllers/criminalcases';

const router = express.Router();

router.post('/', casesCtrl.createCriminalCase);
router.get('/', casesCtrl.getAllCriminalCases);

export default router;
