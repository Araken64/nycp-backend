import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel from '../models/Prisoner';

export const createCriminalCase = (req: Request, res: Response) => {
  if (req.body.criminalCaseNumber) {
    const criminalcase: CriminalCase = new CriminalCaseModel({
      ...req.body,
    });
    criminalcase.save()
      .then(() => res.status(201).json({ message: 'Object saved !' }))
      .catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request Body not conform' });
};

export const getAllCriminalCases = (req: Request, res: Response) => {
  CriminalCaseModel.find()
    .then((criminalcases) => res.status(200).json(criminalcases))
    .catch((error) => res.status(400).json({ error }));
};

export const getOneCriminalCase = (req: Request, res: Response) => {
  CriminalCaseModel.findOne({ criminalCaseNumber: req.params.criminalCaseNumber })
    .then((cc) => res.status(200).json(cc))
    .catch((error) => res.status(404).json({ error }));
};

export const modifyCriminalCase = (req: Request, res: Response) => {
  CriminalCaseModel.findOneAndUpdate({ criminalCaseNumber: req.params.criminalCaseNumber },
    { ...req.body }).then((cc:CriminalCase|null) => {
    if (cc) {
      if (req.body.criminalCaseNumber && req.body.criminalCaseNumber !== cc.criminalCaseNumber) {
        PrisonerModel.updateMany({ criminalCase: cc.criminalCaseNumber },
          { $set: { 'criminalCase.$': req.body.criminalCaseNumber } })
          .then(() => res.status(200).json({ message: 'Criminal Case modified and references updated !' }))
          .catch((error) => res.status(400).json({ error }));
      } else res.status(200).json({ message: 'Criminal Case modified !' });
    } else res.status(404).json({ error: 'CriminalCase not found' });
  }).catch((error) => res.status(400).json({ error }));
};

export const deleteCriminalCase = (req: Request, res: Response) => {
  CriminalCaseModel.findOneAndDelete({
    criminalCaseNumber: req.params.criminalCaseNumber,
  }).then((cc:CriminalCase|null) => {
    if (cc) {
      PrisonerModel.updateMany({ criminalCase: cc.criminalCaseNumber },
        { $pull: { criminalCase: cc.criminalCaseNumber } })
        .then(() => res.status(200).json({ message: 'Criminal Case deleted !' }))
        .catch((error) => res.status(400).json({ error }));
    } else res.status(404).json({ error: 'CriminalCase not found' });
  }).catch((error) => res.status(400).json({ error }));
};
