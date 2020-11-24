import { Request, Response } from 'express';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';
// import { createCriminalCase } from './criminalcases';
// import { createPrisoner, getOnePrisoner, updatePrisoner} from './prisoners';

export default function prevention(/* req: Request, res: Response */) {
  // console.log(req.params);
  // let prisoner: Prisoner|null;
  // let criminalcase: CriminalCase|null;
  // console.log('firstPromise');
  // const promise = new Promise(() => {
  //   console.log('search prisoner model');
  //   PrisonerModel.findOne(
  //     { prisonFileNumber: req.params.prisonFileNumber },
  //   )
  //     .then((p) => { console.log('ThenPrisoner'); prisoner = p; })
  //     .catch(() => {
  //       console.log('catchPrisoner');
  //       createPrisoner(req, res);
  //       PrisonerModel.findOne({ prisonFileNumber: req.params.prisonFileNumber })
  //         .then((p) => { prisoner = p; });
  //     });
  //   console.log('search cirminalCase');
  //   CriminalCaseModel.findOne(
  //     { criminalCaseNumber: req.params.criminalCaseNumber },
  //   )
  //     .then((cc) => { console.log('thenCriminalCase'); criminalcase = cc; })
  //     .catch(() => {
  //       console.log('catchCriminalCase');
  //       createCriminalCase(req, res);
  //       CriminalCaseModel.findOne({ criminalCaseNumber: req.params.criminalCaseNumber })
  //         .then((cc) => { criminalcase = cc; });
  //     });
  // });
  // console.log('secondPromise');
  // promise.then(() => {
  //   console.log('ThenSecondPromise');
  //   if (prisoner != null && criminalcase != null) {
  //     prisoner.criminalCase?.push(criminalcase);
  //     prisoner.save()
  //       .then(() => res.status(201).json({ message: 'Object modified via save() !' }))
  //       .catch((error) => res.status(400).json({ error }));
  //   }
  // });
}

export const prevention2 = async (req: Request, res: Response) => {
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
