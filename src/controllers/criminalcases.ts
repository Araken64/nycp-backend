import express from 'express';
import CriminalCase from '../models/CriminalCase';

export const createCriminalCase = (req:express.Request, res:express.Response) => {
  const criminalCase = new CriminalCase({
    ...req.body,
  });
  criminalCase.save()
    .then(() => res.status(201).json({ message: 'Object saved !' }))
    .catch((error) => res.status(400).json({ error }));
};

export const getAllCriminalCases = () => {

};
