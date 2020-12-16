import express from 'express';
import {
  addCriminalCase, addPrisoner, removeCriminalCase, removeDecision, removePrisoner,
} from '../controllers/extra';

const router = express.Router();

router.put('/prisoner/addCriminalCase/:prisonFileNumber', addCriminalCase);
router.put('/prisoner/removeCriminalCase/:prisonFileNumber', removeCriminalCase);
router.put('/criminalcase/addPrisoner/:criminalCaseNumber', addPrisoner);
router.put('/criminalcase/removePrisoner/:criminalCaseNumber', removePrisoner);
router.put('/prisoner/removeDecision/:prisonFileNumber', removeDecision);

export default router;
