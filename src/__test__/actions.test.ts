import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { TypeDecision } from '../models/Prisoner';

describe('Testing the 5 operations', () => {
  it('tests the INCARCERATION route with right values', async () => {
    const response = await supertest(app).put('/api/incarceration/FakePrisonFileNumber&FakeCriminalCaseNumber').send({
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
    const response = await supertest(app).put('/api/preventive/FakePrisonFileNumber&FakeCriminalCaseNumber').send({
      decision: {
        type: TypeDecision.PRE,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE route with right values', async () => {
    const response = await supertest(app).put('/api/sentence/FakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.SEN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 100,
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the FINAL DISCHARGE route with right values', async () => {
    const response = await supertest(app).put('/api/final_discharge/FakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.FIN,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        dateOfFinalDischarge: new Date('December 15, 2020 23:59:59'),
      },
    });
    expect(response.status).toBe(200);
  });
  it('tests the SENTENCE REDUCTION route with right values', async () => {
    const response = await supertest(app).put('/api/sentence_reduction/FakePrisonFileNumber').send({
      decision: {
        type: TypeDecision.RED,
        dateOfDecision: new Date('November 14, 2019 17:00:00'),
        duration: 31,
      },
    });
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    mongoose.disconnect();
  });
});
