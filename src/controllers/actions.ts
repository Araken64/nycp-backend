import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, {
  Decision, Prisoner, TypeDecision, Sentence,
} from '../models/Prisoner';

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

export const placeInIncarceration = (req: Request, res: Response) : void => {
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
        .then(() => res.status(200).json({ message: `Prisoner ${prisoner.prisonFileNumber} is incarcerate for criminal case ${criminalCase.criminalCaseNumber}` }))
        .catch((error) => res.status(400).json({ error }));
    } else if (!values[0]) res.status(404).json({ error: 'Prisoner not found' });
    else if (!values[1]) res.status(404).json({ error: 'CriminalCase not found' });
  }).catch((error) => res.status(400).json({ error }));
};

export const placeInPreventive = (req: Request, res: Response) : void => {
  const prisonerPromise = PrisonerModel.findOne({
    prisonFileNumber: req.params.prisonFileNumber,
  });
  const criminalCasePromise = CriminalCaseModel.findOne({
    criminalCaseNumber: req.params.criminalCaseNumber,
  });

  Promise.all([prisonerPromise, criminalCasePromise]).then((values) => {
    if (values.every((value) => value)) {
      const [prisoner, criminalCase] = [values[0]!, values[1]!];
      if (prisoner.decision.every((decision) => decision.type !== TypeDecision.INC)) {
        const appendPromise = appendToCriminalCase(prisoner, criminalCase);
        const decisionPromise = addDecision(prisoner, req.body);
        Promise.all([appendPromise, decisionPromise])
          .then(() => res.status(200).json({ message: `Prisoner ${prisoner.prisonFileNumber} is in preventive for criminal case ${criminalCase.criminalCaseNumber}` }))
          .catch((error) => res.status(400).json({ error }));
      } else res.status(403).json({ error: `Prisoner ${prisoner.prisonFileNumber} is already incarcerate, he cannot be in preventive` });
    } else if (!values[0]) res.status(404).json({ error: 'Prisoner not found' });
    else if (!values[1]) res.status(404).json({ error: 'CriminalCase not found' });
  }).catch((error) => res.status(400).json({ error }));
};

const isSentence = (body: any): body is Sentence => {
  interface BodySentence {
    type: string,
    dateOfDecision: string,
    duration: string,
  }

  const stc = body as BodySentence;
  return stc && stc.type === TypeDecision.SEN
    && !Number.isNaN(parseInt(stc.duration, 10))
    && !Number.isNaN(Date.parse(stc.dateOfDecision));
};

export const addSentence = (req: Request, res: Response) => {
  if (isSentence(req.body)) {
    const sentence: Sentence = req.body;
    PrisonerModel.findOne({ prisonFileNumber: req.params.prisonFileNumber })
      .then((prisoner) => {
        if (prisoner) {
          prisoner.decision.push(sentence);
          prisoner.save()
            .then(() => {
              const { type, dateOfDecision } = req.body;
              res.status(200).json({ message: `Decision of ${type} has been taken for Prisoner ${prisoner.prisonFileNumber} the ${dateOfDecision}` });
            })
            .catch((error) => res.status(400).json({ error }));
        } else res.status(404).json({ error: 'Prisoner not found' });
      }).catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: `Request body ${req.body} is not conform to interface Sentence` });
};
