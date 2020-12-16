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
      prisonFileNumber: 'PR_PO_OK',
      givenName: 'fakeGivenName',
      surname: 'fakeSurname',
      dateOfBirth: new Date('September 22, 2018 15:00:00'), // Date.now() does not work (time difference ?)
      placeOfBirth: 'fakePlaceOfBirth',
      dateOfIncaceration: Date.now(),
      motiveLabel: 'fakeMotiveLabel',
      juridictionName: 'fakeJuridictionName',
      criminalCase: ['CC_FAKE_1', 'CC_FAKE_2'],
      decision: [{
        type: TypeDecision.SEN,
        dateOfDecision: Date.now(),
        duration: 1,
        dateOfFinalDischarge: Date.now(),
      }],
    });
    expect(res.status).toBe(201);
  });

  it('tests the GET one prisoner route', async () => {
    const res = await supertest(app).get('/api/prisoners/PR_PO_OK');
    expect(res.status).toBe(200);
  });

  it('tests the POST new prisoner route with already existed number', async () => {
    const response = await supertest(app).post('/api/prisoners').send({
      prisonFileNumber: 'PR_PO_OK',
    });

    expect(response.status).toBe(400);
  });

  it('tests the POST new prisoner route with wrong body', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      juridictionName: 'fakeJuridiction',
    });

    expect(response.status).toBe(403);
  });

  it('tests the PUT modified prisoner route', async () => {
    const res = await supertest(app).put('/api/prisoners/PR_PO_OK').send({
      givenName: 'fakeGivenName2',
    });
    expect(res.status).toBe(200);
  });

  it('tests the DELETE prisoner route', async () => {
    const res = await supertest(app).delete('/api/prisoners/PR_PO_OK').send();
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await PrisonerModel.deleteOne({
      prisonFileNumber: 'PR_PO_OK',
    });
    mongoose.disconnect();
  });
});
