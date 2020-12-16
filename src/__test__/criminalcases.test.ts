import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import CriminalCaseModel from '../models/CriminalCase';

describe('Testing the criminal cases API', () => {
  it('tests the GET all criminal cases route', async () => {
    const res = await supertest(app).get('/api/criminalcases');
    expect(res.status).toBe(200);
  });

  it('tests the POST new criminal case route with correct body', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      criminalCaseNumber: 'CC_PO_OK',
      juridictionName: 'fakeJuridiction',
      dateOfCriminalCase: Date.now(),
      prisoner: ['PR_FAKE_1, PR_FAKE_2'],
    });
    expect(response.status).toBe(201);
  });

  it('tests the GET one criminal case route', async () => {
    const res = await supertest(app).get('/api/criminalcases/CC_PO_OK');
    expect(res.status).toBe(200);
  });

  it('tests the POST new criminal case route with already existed number', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      criminalCaseNumber: 'CC_PO_OK',
    });
    expect(response.status).toBe(400);
  });

  it('tests the POST new criminal case route with wrong body', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      juridictionName: 'fakeJuridiction',
    });
    expect(response.status).toBe(403);
  });

  it('tests the PUT modified prisoner route', async () => {
    const res = await supertest(app).put('/api/criminalcases/CC_PO_OK').send({
      givenName: 'fakeGivenName2',
    });
    expect(res.status).toBe(200);
  });

  it('tests the DELETE prisoner route', async () => {
    const res = await supertest(app).delete('/api/criminalcases/CC_PO_OK');
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await CriminalCaseModel.deleteOne({
      criminalCaseNumber: 'CC_PO_OK',
    });
    mongoose.disconnect();
  });
});
