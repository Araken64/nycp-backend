import { Request, Response } from 'express';
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
  PrisonerModel.updateOne({ prisonFileNumber: req.params.prisonFileNumber },
    { ...req.body, prisonFileNumber: req.params.prisonFileNumber })
    .then(() => res.status(200).json({ message: 'Object modified' }))
    .catch((error) => res.status(400).json({ error }));
};

export const deletePrisoner = (req: Request, res: Response) => {
  PrisonerModel.deleteOne({ prisonFileNumber: req.params.prisonFileNumber })
    .then(() => res.status(200).json({ message: 'Object deleted' }))
    .catch((error) => res.status(400).json({ error }));
};
