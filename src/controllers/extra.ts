import { Request, Response } from 'express';
import { DocumentQuery } from 'mongoose';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';
import PrisonerModel, { Prisoner } from '../models/Prisoner';
import datesAreOnSameDay from './util';

interface ReqBodyCc {
  criminalCaseNumber: string,
}

export const addCriminalCase = (req:Request, res:Response) => {
  const { criminalCaseNumber }:ReqBodyCc = req.body;
  if (criminalCaseNumber) {
    const queryCc: DocumentQuery<CriminalCase|null, CriminalCase, {}> = CriminalCaseModel.findOne({
      criminalCaseNumber,
    });
    const queryPr: DocumentQuery<Prisoner|null, Prisoner, {}> = PrisonerModel.findOne({
      prisonFileNumber: req.params.prisonFileNumber,
    });
    Promise.all([queryPr, queryCc])
      .then((values) => {
        if (values.every((value) => value)) {
          const [pr, cc] = [values[0]!, values[1]!];
          pr.criminalCase.push(cc.criminalCaseNumber);
          cc.prisoner.push(pr.prisonFileNumber);
          Promise.all([pr.save(), cc.save()])
            .then(() => res.status(200).json({ message: `Prisoner ${pr.prisonFileNumber} is linked to Criminal Case ${cc.criminalCaseNumber}` }))
            .catch((error) => res.status(400).json({ error }));
        } else res.status(404).json({ error: 'Prisoner or Criminal Case not found' });
      })
      .catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request body is not conform for this API ' });
};

export const removeCriminalCase = (req:Request, res:Response) => {
  const { criminalCaseNumber }:ReqBodyCc = req.body;
  if (criminalCaseNumber) {
    const queryCc: DocumentQuery<CriminalCase|null, CriminalCase, {}> = CriminalCaseModel.findOne({
      criminalCaseNumber,
    });
    const queryPr: DocumentQuery<Prisoner|null, Prisoner, {}> = PrisonerModel.findOne({
      prisonFileNumber: req.params.prisonFileNumber,
    });
    Promise.all([queryPr, queryCc])
      .then((values) => {
        if (values[0]) {
          const promiseArray:Promise<Prisoner|CriminalCase>[] = [];
          const pr = values[0];
          const newArrayCc = pr.criminalCase.filter((cc) => cc !== criminalCaseNumber);
          pr.criminalCase = newArrayCc;
          promiseArray.push(pr.save());
          if (values[1]) { // no error if Criminal Case is not found
            const cc = values[1];
            const newArrayPr = cc.prisoner.filter(
              (prisoner) => prisoner !== req.params.prisonFileNumber,
            );
            cc.prisoner = newArrayPr;
            promiseArray.push(cc.save());
          }
          Promise.all(promiseArray).then(() => res.status(200).json({
            message: `Criminal Case ${criminalCaseNumber} and Prisoner ${req.params.prisonFileNumber} are no longer linked`,
          })).catch((error) => res.status(400).json({ error }));
        } else res.status(404).json({ message: `Prisoner ${req.params.prisonFileNumber} is not found` });
      }).catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request body is not conform for this API ' });
};

interface ReqBodyPr {
  prisonFileNumber: string,
}

export const addPrisoner = (req:Request, res:Response) => {
  const { prisonFileNumber }:ReqBodyPr = req.body;
  if (prisonFileNumber) {
    const queryPr: DocumentQuery<Prisoner|null, Prisoner, {}> = PrisonerModel.findOne({
      prisonFileNumber,
    });
    const queryCc: DocumentQuery<CriminalCase|null, CriminalCase, {}> = CriminalCaseModel.findOne({
      criminalCaseNumber: req.params.criminalCaseNumber,
    });
    Promise.all([queryCc, queryPr])
      .then((values) => {
        if (values.every((value) => value)) {
          const [cc, pr] = [values[0]!, values[1]!];
          cc.prisoner.push(pr.prisonFileNumber);
          pr.criminalCase.push(cc.criminalCaseNumber);
          Promise.all([cc.save(), pr.save()])
            .then(() => res.status(200).json({ message: `Criminal Case ${cc.criminalCaseNumber} is linked to Prisoner ${pr.prisonFileNumber}` }))
            .catch((error) => res.status(400).json({ error }));
        } else res.status(404).json({ error: 'Prisoner or Criminal Case not found' });
      }).catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request body is not conform for this API ' });
};

export const removePrisoner = (req:Request, res:Response) => {
  const { prisonFileNumber }:ReqBodyPr = req.body;
  if (prisonFileNumber) {
    const queryPr: DocumentQuery<Prisoner|null, Prisoner, {}> = PrisonerModel.findOne({
      prisonFileNumber,
    });
    const queryCc: DocumentQuery<CriminalCase|null, CriminalCase, {}> = CriminalCaseModel.findOne({
      criminalCaseNumber: req.params.criminalCaseNumber,
    });
    Promise.all([queryCc, queryPr])
      .then((values) => {
        if (values[0]) {
          const promiseArray:Promise<Prisoner|CriminalCase>[] = [];
          const cc = values[0];
          const newArrayPr = cc.prisoner.filter((pr) => pr !== prisonFileNumber);
          cc.prisoner = newArrayPr;
          promiseArray.push(cc.save());
          if (values[1]) { // no error if Prisoner is not found
            const pr = values[1];
            const newArrayCc = pr.criminalCase.filter(
              (cCase) => cCase !== req.params.criminalCaseNumber,
            );
            pr.criminalCase = newArrayCc;
            promiseArray.push(pr.save());
          }
          Promise.all(promiseArray).then(() => res.status(200).json({
            message: `Criminal Case ${req.params.criminalCaseNumber} and Prisoner ${prisonFileNumber} are no longer linked`,
          })).catch((error) => res.status(400).json({ error }));
        } else res.status(404).json({ message: `CriminalCase ${req.params.criminalCaseNumber} is not found` });
      }).catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request body is not conform for this API ' });
};

interface ReqBodyDec {
  type: string,
  date: string,
}

export const removeDecision = (req:Request, res:Response) => {
  const { type, date }: ReqBodyDec = req.body;
  if (type && date) {
    PrisonerModel.findOne({
      prisonFileNumber: req.params.prisonFileNumber,
    }).then((prisoner) => {
      if (prisoner) {
        const modifiedDecisions = prisoner.decision.filter((dec) => dec.type !== type
          || !datesAreOnSameDay(new Date(dec.dateOfDecision), new Date(date)));
        prisoner.decision = modifiedDecisions;
        prisoner.save()
          .then(() => res.status(200).json({ message: `Decision of ${type} taken the [${new Date(date)}] is removed` }))
          .catch((error) => res.status(400).json({ error }));
      } else res.status(404).json({ error: `Prisoner ${req.params.prisonFileNumber} is not found` });
    }).catch((error) => res.status(400).json({ error }));
  } else res.status(403).json({ error: 'Request body is not conform for this API ' });
};
