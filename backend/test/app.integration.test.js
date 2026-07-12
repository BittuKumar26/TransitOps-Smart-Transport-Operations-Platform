import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.service, 'TransitOps API');
});

test('GET /api/vehicles without token is unauthorized', async () => {
  const response = await request(app).get('/api/vehicles');

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Not authorized');
});

test('GET /api/reports/csv without token is unauthorized', async () => {
  const response = await request(app).get('/api/reports/csv');

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Not authorized');
});
