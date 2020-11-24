import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Decision, Prisoner } from '../models/Prisoner';

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

const addDecision = (prisoner: Prisoner, body: Decision) : Promise<Prisoner> => {
  prisoner.decision.push({ ...body });
  return prisoner.save();
};

export const placeInJail = (req: Request, res: Response) : void => {
  const prisonerPromise = PrisonerModel.findOne({
    prisonFileNumber: req.params.prisonFileNumber,
  });
  const criminalCasePromise = CriminalCaseModel.findOne({
    criminalCaseNumber: req.params.criminalCaseNumber,
  });

  Promise.all([prisonerPromise, criminalCasePromise]).then((values) => {
    if (values.every((value) => value)) {
      const [prisoner, criminalCase] = [values[0]!, values[1]!];
      const appendPromise = appendToCriminalCase(prisoner, criminalCase);
      const decisionPromise = addDecision(prisoner, req.body);
      Promise.all([appendPromise, decisionPromise])
        .then(() => res.status(200).json({ message: `Prisoner ${prisoner.prisonFileNumber} is in preventive for criminal case ${criminalCase.criminalCaseNumber}` }))
        .catch((error) => res.status(400).json({ error }));
    } else if (!values[0]) res.status(404).json({ error: 'Prisoner not found' });
    else if (!values[1]) res.status(404).json({ error: 'CriminalCase not found' });
  }).catch((error) => res.status(400).json({ error }));
};

export const makeDecision = (req: Request, res: Response) => {
  PrisonerModel.findOne({ prisonFileNumber: req.params.prisonFileNumber })
    .then((prisoner) => {
      if (prisoner) {
        addDecision(prisoner, req.body)
          .then(() => {
            const { type, dateOfDecision } = req.body;
            res.status(200).json({ message: `Decision of ${type} has been taken for Prisoner ${prisoner.prisonFileNumber} the ${dateOfDecision}` });
          })
          .catch((error) => res.status(400).json({ error }));
      } else res.status(404).json({ error: 'Prisoner not found' });
    }).catch((error) => res.status(400).json({ error }));
};
