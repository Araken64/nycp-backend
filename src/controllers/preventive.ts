import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';

const appendToCriminalCase = (prisoner: Prisoner, criminalCase: CriminalCase)
  : Promise<(CriminalCase | Prisoner)[]> => {
  const promisesArray: Array<Promise<CriminalCase | Prisoner>> = [];
  if (!prisoner.criminalCase.includes(criminalCase.criminalCaseNumber)) {
    prisoner.criminalCase.push(criminalCase.criminalCaseNumber);
    promisesArray.push(prisoner.save());
  }
  if (!criminalCase.prisoner.includes(prisoner.prisonFileNumber)) {
    criminalCase.prisoner.push(prisoner.prisonFileNumber);
    promisesArray.push(criminalCase.save());
  }
  return Promise.all(promisesArray);
};

export const prevention = (req: Request, res: Response) : void => {
  const prisonerPromise = PrisonerModel.findOne({
    prisonFileNumber: req.params.prisonFileNumber,
  });
  const criminalCasePromise = CriminalCaseModel.findOne({
    criminalCaseNumber: req.params.criminalCaseNumber,
  });

  Promise.all([prisonerPromise, criminalCasePromise]).then((values) => {
    if (values.every((value) => value)) {
      appendToCriminalCase(values[0]!, values[1]!)
        .then(() => res.status(200).json({ message: `Prisoner ${values[0]!.prisonFileNumber} is in preventive for criminal case ${values[1]!.criminalCaseNumber}` }))
        .catch((error) => res.status(400).json({ error }));
    } else if (!values[0]) res.status(404).json({ error: 'Prisoner not found' });
    else if (!values[1]) res.status(404).json({ error: 'CriminalCase not found' });
  });
};

export const getPrevention = () => {
};
