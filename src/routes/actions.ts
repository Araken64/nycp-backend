import express from 'express';
import { 
  placeInPreventive, placeInIncarceration, addSentence, addFinalDischarge, addSentenceReduction
} from '../controllers/actions';

const router = express.Router();

router.put('/incarceration/:prisonFileNumber&:criminalCaseNumber', placeInIncarceration);
router.put('/preventive/:prisonFileNumber&:criminalCaseNumber', placeInPreventive);
router.put('/sentence/:prisonFileNumber', addSentence);
router.put('/final_discharge/:prisonFileNumber', addFinalDischarge);
router.put('/sentence_reduction/:prisonFileNumber', addSentenceReduction);

export default router;
