import express from 'express';
import { placeInPreventive, placeInIncarceration, addSentence } from '../controllers/actions';

const router = express.Router();

router.put('/incarceration/:prisonFileNumber&:criminalCaseNumber', placeInIncarceration);
router.put('/preventive/:prisonFileNumber&:criminalCaseNumber', placeInPreventive);
router.put('/sentence/:prisonFileNumber', addSentence);
router.put('/final_discharge/:prisonFileNumber', addSentence);
router.put('/sentence_reduction/:prisonFileNumber', addSentence);

export default router;
