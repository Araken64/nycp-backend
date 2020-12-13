import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import PrisonerModel, { TypeDecision } from '../models/Prisoner';
import CriminalCaseModel from '../models/CriminalCase';

describe('Testing the 5 operations', () => {
  beforeAll(async () => {
    const res1 = await supertest(app).post('/api/prisoners').send({
      prisonFileNumber: 'fakePrisonFileNumber',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'),
      placeOfBirth: 'fakePlaceOfBirth',
      juridictionName: 'fakeJuridictionName',
    });
    const res2 = await await supertest(app).post('api/criminalcases').send({
      criminalCaseNumber: 'fakeCriminalCaseNumber',
      juridictionName: 'fakeJuridiction',
      dateOfCriminalCase: Date.now(),
      prisoner: ['testPrisoner1, testPrisoner2'],
    });
    expect(res1.status).toBe(201);
    expect(res1.body.message).toBe('Object saved !');
    expect(res2.status).toBe(201);
    expect(res2.body.message).toBe('Object saved !');
  });
  it('tests the INCARCERATION route with right values', async () => {
    const response = await supertest(app).put('/api/incarceration/fakePrisonFileNumber&fakeCriminalCaseNumber').send({
      decision: {
        type: TypeDecision.INC,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
      },
      dateOfIncarceration: new Date('November 17, 2019 10:00:00'),
      motiveLabel: 'proxénétisme',
    });
    expect(response.status).toBe(200);
  });
  it('tests the PREVENTIVE route with right values', async () => {
    const response = await supertest(app).put('/api/preventive/fakePrisonFileNumber&fakeCriminalCaseNumber').send({
      decision: {
        type: TypeDecision.PRE,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE route with right values', async () => {
    const response = await supertest(app).put('/api/sentence/fakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.SEN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 100,
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the FINAL DISCHARGE route with right values', async () => {
    const response = await supertest(app).put('/api/final_discharge/fakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.FIN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        dateOfFinalDischarge: new Date('December 15, 2020 23:59:59'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE REDUCTION route with right values', async () => {
    const response = await supertest(app).put('/api/sentence_reduction/fakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.RED,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 31,
      },
    });
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    await CriminalCaseModel.deleteOne({
      criminalCaseNumber: 'fakeCriminalCaseNumber',
    });
    await PrisonerModel.deleteOne({
      prisonFileNumber: 'fakePrisonFileNumber',
    });
    mongoose.disconnect();
  });
});
