import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import PrisonerModel, { TypeDecision } from '../models/Prisoner';
import CriminalCaseModel from '../models/CriminalCase';

describe('Testing the 5 operations', () => {
  beforeAll(async () => {
    await new PrisonerModel({
      prisonFileNumber: 'PR_ACT_OK',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'),
      placeOfBirth: 'fakePlaceOfBirth',
      juridictionName: 'fakeJuridictionName',
    }).save();

    await new CriminalCaseModel({
      criminalCaseNumber: 'CC_ACT_OK',
    }).save();
  });
  it('tests the PREVENTIVE route with right values', async () => {
    const response = await supertest(app).put('/api/actions/preventive/PR_ACT_OK&CC_ACT_OK').send({
      decision: {
        type: TypeDecision.PRE,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the INCARCERATION route with right values', async () => {
    const response = await supertest(app).put('/api/actions/incarceration/PR_ACT_OK&CC_ACT_OK').send({
      decision: {
        type: TypeDecision.INC,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
      },
      dateOfIncarceration: new Date('November 17, 2019 10:00:00'),
      motiveLabel: 'proxénétisme',
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE route with right values', async () => {
    const response = await supertest(app).put('/api/actions/sentence/PR_ACT_OK').send({
      decision: {
        type: TypeDecision.SEN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 100,
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the FINAL DISCHARGE route with right values', async () => {
    const response = await supertest(app).put('/api/actions/final_discharge/PR_ACT_OK').send({
      decision: {
        type: TypeDecision.FIN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        dateOfFinalDischarge: new Date('December 15, 2020 23:59:59'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE REDUCTION route with right values', async () => {
    const response = await supertest(app).put('/api/actions/sentence_reduction/PR_ACT_OK').send({
      decision: {
        type: TypeDecision.RED,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 31,
      },
    });
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    const result = await CriminalCaseModel.deleteOne({
      criminalCaseNumber: 'PR_ACT_OK',
    }).then(() => console.log('criminalCase Deleted')).catch(() => console.log('error'));
    const res = await PrisonerModel.deleteOne({
      prisonFileNumber: 'CC_ACT_OK',
    }).then(() => console.log('prisoner Deleted')).catch(() => console.log('error'));
    console.log(result);
    console.log(res);
    mongoose.disconnect();
  });
});
