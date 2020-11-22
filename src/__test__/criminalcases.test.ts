import supertest from 'supertest';
import app from '../app';
import CriminalCaseModel from '../models/CriminalCase';

describe('Testing the criminal cases API', () => {
  it('tests the base route and returns true for status', async () => {
    const res = await supertest(app).get('/api/criminalcases');

    expect(res.status).toBe(200);
    // expect(res.body.status).toBe(true);
  });

  it('tests the post new criminal case endpoint and returns as success message', async () => {
    const response = await supertest(app).post('/api/criminalcases').send({
      criminalCaseNumber: 'fakeNumber',
      juridictionName: 'fakeJuridiction',
      dateOfCriminalCase: Date.now(),
      prisoner: ['testPrisoner1, testPrisoner2'],
    });

    expect(response.status).toBe(201);
    // expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Object saved !');
  });
  afterEach(async () => {
    await CriminalCaseModel.deleteOne({
      criminalCaseNumber: 'fakeNumber',
    });
  });
});
