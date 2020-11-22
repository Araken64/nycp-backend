import express from 'express';
import * as casesCtrl from '../controllers/criminalcases';

const router = express.Router();

router.post('/', casesCtrl.createCriminalCase);
router.get('/', casesCtrl.getAllCriminalCases);
router.put('/:criminalCaseNumber', casesCtrl.modifyCriminalCase);
router.delete('/:criminalCaseNumber', casesCtrl.deleteCriminalCase);

export default router;
