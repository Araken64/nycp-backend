import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import PrisonerModel, { TypeDecision } from '../models/Prisoner';

describe('Testing the prisoners API', () => {
  it('tests the GET all prisoners route', async () => {
    const res = await supertest(app).get('/api/prisoners');
    expect(res.status).toBe(200);
  });

  it('tests the POST new prisoner route', async () => {
    const res = await supertest(app).post('/api/prisoners').send({
      prisonFileNumber: 'fakeNumber',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'), // Date.now() does not work (time difference ?)
      placeOfBirth: 'fakePlaceOfBirth',
      dateOfIncaceration: Date.now(),
      motiveLabel: 'fakeMotiveLabel',
      juridictionName: 'fakeJuridictionName',
      criminalCase: ['fakeCriminalCase1', 'fakeCriminalCase2'],
      decision: [{
        type: TypeDecision.SEN,
        dateOfDecision: Date.now(),
        duration: 1,
        dateOfFinalDischarge: Date.now(),
      }],
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Object saved !');
  });

  it('tests the PUT modified prisoner route', async () => {
    const res = await supertest(app).put('/api/prisoners/fakeNumber').send({
      givenName: 'fakeGivenName2',
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Object modified');
  });

  it('tests the DELETE prisoner route', async () => {
    const res = await supertest(app).delete('/api/prisoners/fakeNumber').send();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Object deleted');
  });

  afterAll(async () => {
    await PrisonerModel.deleteOne({
      prisonFileNumber: 'fakeNumber',
    });
    mongoose.disconnect();
  });
});
