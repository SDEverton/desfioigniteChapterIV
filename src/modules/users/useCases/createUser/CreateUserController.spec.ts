import { hash } from 'bcryptjs';
import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Everton Oliveira',
        email: 'evertonsdsilva@gmail.com',
        password: '12345'
      });

    expect(response.status).toBe(201);
  });
});
