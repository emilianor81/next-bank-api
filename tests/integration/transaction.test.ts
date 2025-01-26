import request from 'supertest';
import app from '../../src/index';
import { Card } from '../../src/models/Card';
import { Account } from '../../src/models/Account';
import mongoose from 'mongoose';
import { beforeAll, describe, it, expect, beforeEach, afterAll } from '@jest/globals';


describe('Transaction API', () => {
  let token: string;
  let accountId: string;

  beforeAll(async () => { 
    // Configurar base de datos de prueba
    await mongoose.connect(process.env.MONGODB_URI_TEST!);
  });

  beforeEach(async () => {
    // Crear datos de prueba y obtener token
    const card = await Card.create({
      cardNumber: '4532000000001234',
      pin: '1234',
      type: 'debit',
      isActivated: true
    });

    const response = await request(app)
      .post('/api/auth/validate-card')
      .send({
        cardNumber: '4532000000001234',
        pin: '1234'
      });

    token = response.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/transactions/withdraw', () => {
    it('should withdraw money successfully', async () => {
      const response = await request(app)
        .post('/api/transactions/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 100,
          atmBank: 'BANCO_TEST'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transaction');
      expect(response.body).toHaveProperty('newBalance');
    });
  });
});