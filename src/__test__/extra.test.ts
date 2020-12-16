import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import PrisonerModel, { Prisoner, TypeDecision } from '../models/Prisoner';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';

describe('Testing the extra API', () => {
  beforeAll(async () => {
    const pr:Prisoner = new PrisonerModel({
      prisonFileNumber: 'PR_EX_OK',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'),
      placeOfBirth: 'fakePlaceOfBirth',
      juridictionName: 'fakeJuridictionName',
      decision: [{
        type: TypeDecision.PRE,
        dateOfDecision: Date.now(),
      }],
    });
    const cc:CriminalCase = new CriminalCaseModel({ criminalCaseNumber: 'CC_EX_OK' });

    await Promise.all([pr.save(), cc.save()]);
  });

  it('tests to add CriminalCase to a Prisoner with PUT route', async () => {
    const res = await supertest(app).put('/api/extra/prisoner/addCriminalCase/PR_EX_OK').send({
      criminalCaseNumber: 'CC_EX_OK',
    });

    expect(res.status).toBe(200);
  });

  it('tests to remove CriminalCase from a Prisoner with PUT route', async () => {
    const res = await supertest(app).put('/api/extra/prisoner/removeCriminalCase/PR_EX_OK').send({
      criminalCaseNumber: 'CC_EX_OK',
    });

    expect(res.status).toBe(200);
  });

  it('tests to add Prisoner to a CriminalCase with PUT route', async () => {
    const res = await supertest(app).put('/api/extra/criminalcase/addPrisoner/CC_EX_OK').send({
      prisonFileNumber: 'PR_EX_OK',
    });

    expect(res.status).toBe(200);
  });

  it('tests to remove Prisoner from a CriminalCase with PUT route', async () => {
    const res = await supertest(app).put('/api/extra/criminalcase/removePrisoner/CC_EX_OK').send({
      prisonFileNumber: 'PR_EX_OK',
    });

    expect(res.status).toBe(200);
  });

  it('tests to remove Decision from a Prisoner with PUT route', async () => {
    const res = await supertest(app).put('/api/extra/prisoner/removeDecision/PR_EX_OK').send({
      type: TypeDecision.PRE,
      date: Date.now(),
    });

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    const promisePr = PrisonerModel.deleteOne({ prisonFileNumber: 'PR_EX_OK' });
    const promiseCc = CriminalCaseModel.deleteOne({ criminalCaseNumber: 'CC_EX_OK' });
    await Promise.all([promisePr, promiseCc]);
    mongoose.disconnect();
  });
});
