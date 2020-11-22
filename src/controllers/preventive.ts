import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';
import { createCriminalCase } from './criminalcases';
import { createPrisoner } from './prisoners';

export default function prevention(req: Request, res: Response) {
  let prisoner: Prisoner|null;
  let criminalcase: CriminalCase|null;
  const promise = new Promise(() => {
    PrisonerModel.findOne(
      { prisonFileNumber: req.params.prisonFileNumber },
    )
      .then((p) => { prisoner = p; })
      .catch(() => {
        createPrisoner(req, res);
        PrisonerModel.findOne({ prisonFileNumber: req.params.prisonFileNumber })
          .then((p) => { prisoner = p; });
      });
    CriminalCaseModel.findOne(
      { criminalCaseNumber: req.params.criminalCaseNumber },
    )
      .then((cc) => { criminalcase = cc; })
      .catch(() => {
        createCriminalCase(req, res);
        CriminalCaseModel.findOne({ criminalCaseNumber: req.params.criminalCaseNumber })
          .then((cc) => { criminalcase = cc; });
      });
  });
  promise.then(() => {
    if (prisoner != null && criminalcase != null) {
      prisoner.criminalCase?.push(criminalcase);
      prisoner.save()
        .then(() => res.status(201).json({ message: 'Object modified via save() !' }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
}
