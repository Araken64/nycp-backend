import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';

export const createCriminalCase = (req: Request, res: Response) => {
  const criminalcase: CriminalCase = new CriminalCaseModel({
    ...req.body,
  });
  criminalcase.save()
    .then(() => res.status(201).json({ message: 'Object saved !' }))
    .catch((error) => res.status(400).json({ error }));
};

export const getAllCriminalCases = (req: Request, res: Response) => {
  CriminalCaseModel.find()
    .then((criminalcases) => res.status(200).json(criminalcases))
    .catch((error) => res.status(400).json({ error }));
};
