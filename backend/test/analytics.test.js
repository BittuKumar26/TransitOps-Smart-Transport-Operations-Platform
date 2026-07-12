import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFleetUtilization, calculateOperationalCost } from '../src/services/analyticsService.js';
import { calculateFuelEfficiency } from '../src/utils/calculateFuelEfficiency.js';
import { calculateROI } from '../src/utils/calculateROI.js';

test('calculateFleetUtilization returns rounded percent', () => {
  assert.equal(calculateFleetUtilization(7, 20), 35);
  assert.equal(calculateFleetUtilization(1, 3), 33.33);
  assert.equal(calculateFleetUtilization(0, 0), 0);
});

test('calculateOperationalCost sums fuel and maintenance', () => {
  assert.equal(calculateOperationalCost(100.125, 49.335), 149.46);
});

test('calculateFuelEfficiency handles zero fuel safely', () => {
  assert.equal(calculateFuelEfficiency({ distance: 100, fuel: 0 }), 0);
  assert.equal(calculateFuelEfficiency({ distance: 245, fuel: 7 }), 35);
});

test('calculateROI computes percentage return', () => {
  const roi = calculateROI({ revenue: 10000, fuel: 2000, maintenance: 1000, acquisitionCost: 5000 });
  assert.equal(roi, 140);
});