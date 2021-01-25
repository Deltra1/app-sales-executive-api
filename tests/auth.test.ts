import * as request from 'supertest';

import setupDb, { initalSalesExecutiveUser } from './fixtures/setupDb';
import app from '../src/app';

describe('Testing Auth route', () => {
  beforeAll(async () => {
    await setupDb();
  });

  test('User can login', async () => {
    const response = await request
      .default(app)
      .post('/auth/login')
      .send({
        userId: initalSalesExecutiveUser.userId,
        password: initalSalesExecutiveUser.password,
      })
      .expect(200);
  });

  test('User cannot login', async () => {
    const response = await request
      .default(app)
      .post('/auth/login')
      .send({
        userId: 'wronguserid',
        password: 'wrong password',
      })
      .expect(401);
  });

  test('User can logout', async () => {
    const response = await request
      .default(app)
      .post('/auth/login')
      .send({
        userId: initalSalesExecutiveUser.userId,
        password: initalSalesExecutiveUser.password,
      })
      .expect(200);

    await request
      .default(app)
      .get('/auth/logout')
      .set('Authorization', `Bearer ${response.body.token.accessToken}`)
      .expect(204);
  });

  test('User can regenerate token', async () => {
    const response = await request
      .default(app)
      .post('/auth/login')
      .send({
        userId: initalSalesExecutiveUser.userId,
        password: initalSalesExecutiveUser.password,
      })
      .expect(200);
    const regenerateResponse = await request
      .default(app)
      .post('/auth/refresh-token')
      .send({ refreshToken: response.body.token.refreshToken })
      .expect(200);
  });

  test('User cannot regenerate access token with invalid token', async () => {
    const regenerateResponse = await request
      .default(app)
      .post('/auth/refresh-token')
      .send({
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWE2YzQ4YTM3MWNiMDAxZDIwM2MyNyIsImlhdCI6MTU4ODc0NTE4NywiZXhwIjoxNTg4NzQ3MTg3fQ.Au3tyz84nNLXGuZPmZKBkTourYlzV8kU2b1hztS2lHs',
      })
      .expect(401);
  });

  test('User can logout all users', async () => {
    const response = await request
      .default(app)
      .post('/auth/login')
      .send({
        userId: initalSalesExecutiveUser.userId,
        password: initalSalesExecutiveUser.password,
      })
      .expect(200);

    await request
      .default(app)
      .get('/auth/logout-all')
      .set('Authorization', `Bearer ${response.body.token.accessToken}`)
      .expect(204);
  });
});
