import request from 'supertest';
import app from '../../src/app';

describe('Endpoint de Salud (Health)', () => {
  it('debe devolver 200 ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
