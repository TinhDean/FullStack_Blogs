import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from './app';
import Blog from './models/blog.model';

vi.mock('./models/blog.model', () => ({
  default: {
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn()
  }
}));

describe('App Endpoints & Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('should forward async controller errors to the global error handler (500 JSON)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    (Blog.findOne as any).mockReturnValue({
      populate: vi.fn().mockRejectedValue(new Error('Database unavailable'))
    });

    const response = await request(app).get('/api/blogs/507f1f77bcf86cd799439011');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Database unavailable' });
  });

  it('should map Mongoose CastError (invalid id) to 400', async () => {
    const castError = Object.assign(new Error('Cast to ObjectId failed'), {
      name: 'CastError',
      path: '_id',
      value: 'not-an-id'
    });
    (Blog.findOne as any).mockReturnValue({ populate: vi.fn().mockRejectedValue(castError) });

    const response = await request(app).get('/api/blogs/not-an-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid _id: not-an-id');
  });

  it('should require a Bearer token for protected routes', async () => {
    const response = await request(app).post('/api/blogs').send({ title: 'T', content: 'C' });

    expect(response.status).toBe(401);
  });

  describe('CORS', () => {
    it('should allow the local frontend origin', async () => {
      const response = await request(app).get('/api/health').set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should not send CORS headers for unknown origins', async () => {
      const response = await request(app).get('/api/health').set('Origin', 'https://evil.example.com');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
