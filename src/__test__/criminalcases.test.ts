import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import CriminalCaseModel from '../models/CriminalCase';

describe('Testing the criminal cases API', () => {
  it('tests the GET all criminal cases route', async () => {
    const res = await supertest(app).get('/api/criminalcases');

    expect(res.status).toBe(200);
  });

  it('tests the POST new criminal cases route', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      criminalCaseNumber: 'fakeNumber',
      juridictionName: 'fakeJuridiction',
      dateOfCriminalCase: Date.now(),
      prisoner: ['testPrisoner1, testPrisoner2'],
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Object saved !');
  });

  it('tests the PUT modified prisoner route', async () => {
    const res = await supertest(app).put('/api/criminalcases/fakeNumber').send({
      givenName: 'fakeGivenName2',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Object modified !');
  });

  it('tests the DELETE prisoner route', async () => {
    const res = await supertest(app).delete('/api/criminalcases/fakeNumber');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Object deleted !');
  });

  afterAll(async () => {
    await CriminalCaseModel.deleteOne({
      criminalCaseNumber: 'fakeNumber',
    });
    mongoose.disconnect();
  });
});
