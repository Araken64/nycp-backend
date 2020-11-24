import express from 'express';
import { prevention2 } from '../controllers/preventive';

const router = express.Router();

router.put('/:prisonFileNumber&:criminalCaseNumber', prevention2);

export default router;
