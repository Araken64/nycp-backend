import express from 'express';
import { prevention } from '../controllers/preventive';

const router = express.Router();

router.put('/:prisonFileNumber&:criminalCaseNumber', prevention);

export default router;
