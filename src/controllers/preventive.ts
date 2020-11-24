import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';

export const prevention = async (req: Request, res: Response) => {
  const existsPrisoner = await PrisonerModel.exists({
    prisonFileNumber: req.params.prisonFileNumber,
  }).then((exists) => exists);

  const existsCriminalCase = await CriminalCaseModel.exists({
    criminalCaseNumber: req.params.criminalCaseNumber,
  }).then((exists) => exists);

  if (existsPrisoner && existsCriminalCase) {
    const updatingCriminalCase = CriminalCaseModel.updateOne(
      { criminalCaseNumber: req.params.criminalCaseNumber },
      { $push: { prisoner: req.params.prisonFileNumber } },
    );
    const updatingPrisoner = PrisonerModel.updateOne(
      { prisonFileNumber: req.params.prisonFileNumber },
      { $push: { criminalCase: req.params.criminalCaseNumber } },
    );
    Promise.all([updatingCriminalCase, updatingPrisoner])
      .then(() => res.status(200).json({ message: `Prisoner ${req.params.prisonFileNumber} is in preventive for criminal case ${req.params.criminalCaseNumber}` }))
      .catch((error) => res.status(400).json({ error }));
  } else if (!existsPrisoner) res.status(404).json({ error: 'Prisoner not found' });
  else if (!existsCriminalCase) res.status(404).json({ error: 'CriminalCase not found' });
};

export const getPrevention = () => {
};
