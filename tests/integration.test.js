const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');

describe('Integration Tests', () => {
  describe('Full Application Flow', () => {
    test('should serve complete application with all assets', async () => {
      // Test main page
      const mainResponse = await request(app)
        .get('/')
        .expect(200);
      
      expect(mainResponse.headers['content-type']).toMatch(/text\/html/);
      
      // Test that the HTML contains expected content
      expect(mainResponse.text).toContain('DevOps Bootcamp');
      expect(mainResponse.text).toContain('script.js');
      expect(mainResponse.text).toContain('styles.css');
    });

    test('should serve all static assets correctly', async () => {
      const assets = ['index.html', 'styles.css', 'script.js', '404.html'];
      
      for (const asset of assets) {
        const response = await request(app)
          .get(`/${asset}`)
          .expect(200);
        
        expect(response.status).toBe(200);
      }
    });

    test('should handle health check in production-like environment', async () => {
      // Set NODE_ENV to production
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      
      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Scenarios', () => {
    test('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/non-existent-page')
        .expect(404);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/%invalid%url%')
        .expect(404);
      
      expect(response.status).toBe(404);
    });
  });

  describe('Content Validation', () => {
    test('should serve valid HTML', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      const html = response.text;
      
      // Basic HTML structure validation
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    test('should include all required meta tags', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      const html = response.text;
      
      expect(html).toContain('charset="UTF-8"');
      expect(html).toContain('viewport');
      expect(html).toContain('title');
    });

    test('should include all CSS and JS references', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      const html = response.text;
      
      expect(html).toContain('styles.css');
      expect(html).toContain('script.js');
    });
  });

  describe('Performance Tests', () => {
    test('should respond to health check quickly', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Should respond within 100ms
      expect(responseTime).toBeLessThan(100);
    });

    test('should serve static files efficiently', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/index.html')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Should respond within 200ms
      expect(responseTime).toBeLessThan(200);
    });
  });

  describe('Security Tests', () => {
    test('should not expose server information in headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      // Should not expose server version
      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['server']).toBeUndefined();
    });

    test('should handle invalid requests gracefully', async () => {
      const invalidPaths = [
        '/nonexistent',
        '/invalid-path',
        '/test/../test'
      ];
      
      for (const invalidPath of invalidPaths) {
        const response = await request(app)
          .get(invalidPath)
          .expect(404);
        
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch(/text\/html/);
      }
    });
  });

  describe('Concurrent Requests', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = [
        request(app).get('/health'),
        request(app).get('/'),
        request(app).get('/index.html'),
        request(app).get('/styles.css'),
        request(app).get('/script.js')
      ];
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('File System Integration', () => {
    test('should serve files that actually exist', async () => {
      const publicDir = path.join(__dirname, '../public');
      const files = ['index.html', 'styles.css', 'script.js', '404.html'];
      
      for (const file of files) {
        const filePath = path.join(publicDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        
        const response = await request(app)
          .get(`/${file}`)
          .expect(200);
        
        expect(response.status).toBe(200);
      }
    });
  });
});
