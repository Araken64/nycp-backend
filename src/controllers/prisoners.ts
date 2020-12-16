import { Request, Response } from 'express';
import CriminalCaseModel from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';

export const createPrisoner = (req: Request, res: Response) => {
  const prisoner: Prisoner = new PrisonerModel({
    ...req.body,
  });
  prisoner.save()
    .then(() => res.status(201).json({ message: 'Object saved !' }))
    .catch((error) => res.status(400).json({ error }));
};

export const getAllPrisoners = (req: Request, res: Response) => {
  PrisonerModel.find()
    .then((prisoners) => res.status(200).json(prisoners))
    .catch((error) => res.status(400).json({ error }));
};

export const getOnePrisoner = (req: Request, res: Response) => {
  PrisonerModel.findOne({ prisonFileNumber: req.params.prisonFileNumber })
    .then((prisoner) => res.status(200).json(prisoner))
    .catch((error) => res.status(404).json({ error }));
};

export const updatePrisoner = (req: Request, res: Response) => {
  PrisonerModel.findOneAndUpdate({ prisonFileNumber: req.params.prisonFileNumber },
    { ...req.body }).then((pr:Prisoner|null) => {
    if (pr) {
      if (req.body.prisonFileNumber && req.body.prisonFileNumber !== pr.prisonFileNumber) {
        CriminalCaseModel.updateMany({ prisoner: pr.prisonFileNumber },
          { $set: { 'prisoner.$': req.body.prisonFileNumber } })
          .then(() => res.status(200).json({ message: 'Prisoner modified and references updated !' }))
          .catch((error) => res.status(400).json({ error }));
      } else res.status(200).json({ message: 'Prisoner modified !' });
    } else res.status(404).json({ error: 'Prisoner not found' });
  }).catch((error) => res.status(400).json({ error }));
};

export const deletePrisoner = (req: Request, res: Response) => {
  PrisonerModel.findOneAndDelete({
    prisonFileNumber: req.params.prisonFileNumber,
  }).then((pr:Prisoner|null) => {
    if (pr) {
      CriminalCaseModel.updateMany({ prisoner: pr.prisonFileNumber },
        { $pull: { prisoner: pr.prisonFileNumber } })
        .then(() => res.status(200).json({ message: 'Prisoner deleted and references updated !' }))
        .catch((error) => res.status(400).json({ error }));
    } else res.status(404).json({ error: 'Prisoner not found' });
  }).catch((error) => res.status(400).json({ error }));
};
