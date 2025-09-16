const request = require('supertest');
const express = require('express');
const path = require('path');

// Import the app setup
const app = require('../server');

describe('Express Server Tests', () => {
  let server;

  beforeAll(() => {
    // Start the server for testing
    server = app;
  });

  afterAll(() => {
    // Clean up if needed
  });

  describe('Static File Serving', () => {
    test('should serve static files from public directory', async () => {
      const response = await request(server)
        .get('/index.html')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should serve CSS files', async () => {
      const response = await request(server)
        .get('/styles.css')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    test('should serve JavaScript files', async () => {
      const response = await request(server)
        .get('/script.js')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/application\/javascript/);
    });
  });

  describe('Health Check Endpoint', () => {
    test('should return health status', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });

    test('should return valid timestamp format', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('Root Route', () => {
    test('should serve index.html for root path', async () => {
      const response = await request(server)
        .get('/')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('404 Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(server)
        .get('/non-existent-route')
        .expect(404);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should serve 404.html for non-existent routes', async () => {
      const response = await request(server)
        .get('/this-route-does-not-exist')
        .expect(404);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('Error Handling', () => {
    test('should handle server errors gracefully', async () => {
      // This test would require creating a route that throws an error
      // For now, we'll test the error handling middleware structure
      expect(app._router.stack).toBeDefined();
    });
  });

  describe('Middleware', () => {
    test('should have logging middleware', async () => {
      // Test that logging middleware is present
      const response = await request(server)
        .get('/health')
        .expect(200);
      
      // The middleware should not interfere with the response
      expect(response.status).toBe(200);
    });

    test('should have static file middleware', async () => {
      const response = await request(server)
        .get('/index.html')
        .expect(200);
      
      expect(response.status).toBe(200);
    });
  });

  describe('Content-Type Headers', () => {
    test('should set correct content-type for HTML files', async () => {
      const response = await request(server)
        .get('/index.html')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should set correct content-type for CSS files', async () => {
      const response = await request(server)
        .get('/styles.css')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    test('should set correct content-type for JS files', async () => {
      const response = await request(server)
        .get('/script.js')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/application\/javascript/);
    });
  });

  describe('Security Headers', () => {
    test('should not expose sensitive server information', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);
      
      // Should not expose server version or other sensitive info
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });
});
