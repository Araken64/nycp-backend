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

export const getAllPrisoners = () => {

};
