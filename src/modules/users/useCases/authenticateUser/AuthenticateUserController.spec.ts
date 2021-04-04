import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { createConnection } from 'typeorm';
import { decode } from 'jsonwebtoken';

import { app } from '../../../../app';

let connection: Connection;

describe('Session controller', () => {
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

  it('should be able to authenticate an user', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    expect(responseToken.body).toHaveProperty('token');
  });

  it('should be able to validate token', async () => {
    const responseToken = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'admin@gmail.com', password: 'admin' });

      const { token } = responseToken.body;

      const decoded: any = decode(token);

      let valid: Boolean = false;
      if (Date.now() <= decoded.exp * 1000) {
        valid = true
      }

    expect(valid).toBe(true);
  });
});
