import express from 'express';
import { makeDecision, placeInJail } from '../controllers/actions';

const router = express.Router();

router.put('/incarcerer/:prisonFileNumber&:criminalCaseNumber', placeInJail);
router.put('/preventive/:prisonFileNumber&:criminalCaseNumber', placeInJail);
router.put('/sentence/:prisonFileNumber', makeDecision);
router.put('/final_discharge/:prisonFileNumber', makeDecision);
router.put('/sentence_reduction/:prisonFileNumber', makeDecision);

export default router;
