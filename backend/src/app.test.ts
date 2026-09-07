import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('App Endpoints & Integration', () => {
  it('GET /api/health should return 200 and { status: "ok" }', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('GET /api/unknown-route should return 404 JSON', async () => {
    const response = await request(app).get('/api/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Route not found');
  });
});
