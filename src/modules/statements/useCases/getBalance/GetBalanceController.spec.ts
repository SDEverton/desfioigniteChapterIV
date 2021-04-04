import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { createConnection } from 'typeorm';
import { decode } from 'jsonwebtoken';

import { app } from '../../../../app';

let connection: Connection;

describe('Statements controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(`INSERT INTO USERS(id, name, email, password)
    VALUES('${id}', 'admin', 'admin@gmail.com', '${password}')`);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to balance an user', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    const { token } = responseToken.body;

    const balance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`,
    });

    expect(balance.body).toHaveProperty('balance');
  });

  it('should be able to create deposit an user', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    const { token } = responseToken.body;

    const deposit = await request(app)
        .post('/api/v1/statements/deposit').send({
          type: 'deposit',
          amount: 10,
          description: 'oi'
        }).set({
          Authorization: `Bearer ${token}`,
        });

    expect(deposit.body).toHaveProperty('id');
  });

  it('should be able to create withdraw an user', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    const { token } = responseToken.body;

    const withdraw = await request(app)
        .post('/api/v1/statements/withdraw').send({
          type: 'withdraw',
          amount: 10,
          description: 'oi'
        }).set({
          Authorization: `Bearer ${token}`,
        });

    expect(withdraw.body).toHaveProperty('id');
  });

  it('should be able to create statement_id an user', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    const { token } = responseToken.body;

    const deposit = await request(app)
        .post('/api/v1/statements/deposit').send({
          type: 'deposit',
          amount: 10,
          description: 'oi'
        }).set({
          Authorization: `Bearer ${token}`,
        });

    const statement = await request(app)
        .get(`/api/v1/statements/${deposit.body.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

    expect(statement.body).toHaveProperty('id');
  });
});
