import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import PrisonerModel, { Prisoner, TypeDecision } from '../models/Prisoner';
import CriminalCaseModel, { CriminalCase } from '../models/CriminalCase';

describe('Testing the 5 operations', () => {
  beforeAll(async () => {
    const pr:Prisoner = new PrisonerModel({
      prisonFileNumber: 'PR_ACT_OK',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'),
      placeOfBirth: 'fakePlaceOfBirth',
      juridictionName: 'fakeJuridictionName',
    });
    const cc:CriminalCase = new CriminalCaseModel({ criminalCaseNumber: 'CC_ACT_OK' });

    await Promise.all([pr.save(), cc.save()]);
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

  it('tests the impossibilty to add two times a prisoner in PREVENTIVE', async () => {
    const response = await supertest(app).put('/api/actions/preventive/PR_ACT_OK&CC_ACT_OK').send({
      decision: {
        type: TypeDecision.PRE,
        dateOfDecision: new Date('November 19, 2019 17:00:00'),
      },
    });
    expect(response.status).toBe(403);
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

  it('tests the impossibilty to incarcerate two times a prisoner', async () => {
    const response = await supertest(app).put('/api/actions/preventive/PR_ACT_OK&CC_ACT_OK').send({
      decision: {
        type: TypeDecision.INC,
        dateOfDecision: new Date('November 19, 2019 17:00:00'),
      },
    });
    expect(response.status).toBe(403);
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

  it('tests to impossibilty to give a decision of same type the same day for a prisoner', async () => {
    const response = await supertest(app).put('/api/actions/sentence_reduction/PR_ACT_OK').send({
      decision: {
        type: TypeDecision.RED,
        dateOfDecision: new Date('November 14, 2019 20:00:00'),
        duration: 15,
      },
    });
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    const promisePr = PrisonerModel.deleteOne({ prisonFileNumber: 'PR_ACT_OK' });
    const promiseCc = CriminalCaseModel.deleteOne({ criminalCaseNumber: 'CC_ACT_OK' });
    await Promise.all([promisePr, promiseCc]);

    mongoose.disconnect();
  });
});
