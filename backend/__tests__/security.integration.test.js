const request = require('supertest');
const express = require('express');
const session = require('express-session');
const securityRoutes = require('../routes/security');
const { generateTestJWT } = require('./testUtils');

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use('/api/security', securityRoutes);


const jwt = generateTestJWT();
const testSessionId = 'integration-test-session';
// Helper to add Authorization and X-Test-Session headers
const authHeader = { Authorization: `Bearer ${jwt}`, 'X-Test-Session': testSessionId };

describe('Security Checks Integration', () => {
  it('should pass all security checks in sequence', async () => {
    // Start check
    await request(app)
      .post('/api/security/start-check')
      .set(authHeader)
      .expect(200);

    // Browser check
    await request(app)
      .post('/api/security/browser-check')
      .set(authHeader)
      .send({ userAgent: 'test', devtoolsOpen: false, screenWidth: 1024, screenHeight: 768 })
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    // Network check
    await request(app)
      .post('/api/security/network-check')
      .set(authHeader)
      .send({ isVPN: false, location: 'A', expectedLocation: 'A' })
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    // Device check
    await request(app)
      .post('/api/security/device-check')
      .set(authHeader)
      .send({ camera: 'granted', microphone: 'granted' })
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    // VM check
    await request(app)
      .post('/api/security/vm-check')
      .set(authHeader)
      .send({ platform: 'Windows' })
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    // Screen check
    await request(app)
      .post('/api/security/screen-check')
      .set(authHeader)
      .send({ focused: true, tabSwitches: 0 })
      .expect(200)
      .expect(res => expect(res.body.success).toBe(true));

    // Final status
    await request(app)
      .post('/api/security/final-status')
      .set(authHeader)
      .expect(200)
      .expect(res => expect(res.body.status).toBe('PASS'));
  });
});
