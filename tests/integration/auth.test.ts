import request from 'supertest';
import app from '../../src/index';
import { Card } from '../../src/models/Card';
import mongoose from 'mongoose';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Card.deleteMany({});
  });

  it('should activate a new card', async () => {
    const card = await Card.create({
      cardNumber: '4532000000001234',
      pin: '1234',
      type: 'debit',
      isActivated: false
    });

    const response = await request(app)
      .post('/api/auth/activate-card')
      .send({
        cardNumber: card.cardNumber,
        initialPin: '1234'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Tarjeta activada exitosamente');
  });

  it('should change PIN', async () => {
    const card = await Card.create({
      cardNumber: '4532000000001234',
      pin: '1234',
      type: 'debit',
      isActivated: true
    });

    // Primero obtenemos el token
    const authResponse = await request(app)
      .post('/api/auth/validate-card')
      .send({
        cardNumber: card.cardNumber,
        pin: '1234'
      });

    const response = await request(app)
      .put('/api/cards/change-pin')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send({
        currentPin: '1234',
        newPin: '5678'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'PIN actualizado exitosamente');
  });
});