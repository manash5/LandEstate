const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

describe('API Security - Critical Security Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
  });

  describe('Critical Security Headers', () => {
    it('should include security headers to prevent common attacks', async () => {
      app.use(helmet());
      
      app.get('/test', (req, res) => {
        res.json({ message: 'test' });
      });

      const response = await request(app)
        .get('/test')
        .expect(200);

      // Check for critical security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    it('should prevent clickjacking attacks', async () => {
      app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        next();
      });

      app.get('/test', (req, res) => {
        res.json({ message: 'test' });
      });

      const response = await request(app)
        .get('/test')
        .expect(200);

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should prevent MIME type sniffing', async () => {
      app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        next();
      });

      app.get('/test', (req, res) => {
        res.json({ message: 'test' });
      });

      const response = await request(app)
        .get('/test')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Critical Input Validation', () => {
    it('should reject requests with oversized JSON payloads', async () => {
      app.use(express.json({ limit: '1kb' }));
      
      app.post('/test', (req, res) => {
        res.json({ received: req.body });
      });

      const largePayload = {
        data: 'x'.repeat(2000) // 2KB of data
      };

      const response = await request(app)
        .post('/test')
        .send(largePayload)
        .expect(413);

      expect(response.body.message || response.text).toContain('too large');
    });

    it('should validate Content-Type headers', async () => {
      app.post('/test', (req, res) => {
        if (req.get('Content-Type') && !req.get('Content-Type').includes('application/json')) {
          return res.status(400).json({ error: 'Invalid content type' });
        }
        res.json({ message: 'valid' });
      });

      // Test with invalid content type
      const response = await request(app)
        .post('/test')
        .set('Content-Type', 'text/plain')
        .send('malicious data')
        .expect(400);

      expect(response.body.error).toBe('Invalid content type');
    });

    it('should handle malformed JSON gracefully', async () => {
      app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
          return res.status(400).json({ error: 'Invalid JSON format' });
        }
        next(err);
      });

      app.post('/test', (req, res) => {
        res.json({ received: req.body });
      });

      const response = await request(app)
        .post('/test')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.error).toBe('Invalid JSON format');
    });
  });

  describe('Critical Rate Limiting', () => {
    it('should implement rate limiting for API endpoints', async () => {
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        message: 'Too many requests from this IP',
        standardHeaders: true,
        legacyHeaders: false,
      });

      app.use('/api/', limiter);
      
      app.get('/api/test', (req, res) => {
        res.json({ message: 'success' });
      });

      // Make requests up to the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/test')
          .expect(200);
      }

      // The 6th request should be rate limited
      const response = await request(app)
        .get('/api/test')
        .expect(429);

      expect(response.text).toContain('Too many requests');
    });

    it('should have different rate limits for different endpoints', async () => {
      const strictLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 2,
        message: 'Strict rate limit exceeded'
      });

      const generalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: 'General rate limit exceeded'
      });

      app.use('/api/auth/', strictLimiter);
      app.use('/api/', generalLimiter);

      app.post('/api/auth/login', (req, res) => {
        res.json({ message: 'login attempt' });
      });

      app.get('/api/properties', (req, res) => {
        res.json({ message: 'properties' });
      });

      // Test strict rate limiting on auth endpoint
      await request(app).post('/api/auth/login').expect(200);
      await request(app).post('/api/auth/login').expect(200);
      
      const response = await request(app)
        .post('/api/auth/login')
        .expect(429);

      expect(response.text).toContain('Strict rate limit exceeded');
    });
  });

  describe('Critical CORS Security', () => {
    it('should implement secure CORS policy', async () => {
      app.use((req, res, next) => {
        const allowedOrigins = ['https://yourdomain.com', 'https://www.yourdomain.com'];
        const origin = req.headers.origin;
        
        if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '3600');
        
        if (req.method === 'OPTIONS') {
          res.status(200).end();
          return;
        }
        
        next();
      });

      app.get('/api/test', (req, res) => {
        res.json({ message: 'cors test' });
      });

      // Test with allowed origin
      const allowedResponse = await request(app)
        .get('/api/test')
        .set('Origin', 'https://yourdomain.com')
        .expect(200);

      expect(allowedResponse.headers['access-control-allow-origin']).toBe('https://yourdomain.com');

      // Test with disallowed origin
      const disallowedResponse = await request(app)
        .get('/api/test')
        .set('Origin', 'https://malicious-site.com')
        .expect(200);

      expect(disallowedResponse.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should handle preflight OPTIONS requests securely', async () => {
      app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.setHeader('Access-Control-Max-Age', '3600');
          res.status(200).end();
          return;
        }
        next();
      });

      app.post('/api/test', (req, res) => {
        res.json({ message: 'post test' });
      });

      const response = await request(app)
        .options('/api/test')
        .expect(200);

      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-headers']).toContain('Authorization');
    });
  });

  describe('Critical Error Handling', () => {
    it('should not expose stack traces in production', async () => {
      app.get('/error', (req, res) => {
        throw new Error('Internal server error with sensitive info');
      });

      // Error handler that doesn't expose stack traces
      app.use((err, req, res, next) => {
        console.error(err.stack); // Log internally but don't expose

        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Something went wrong. Please try again later.'
        });
      });

      const response = await request(app)
        .get('/error')
        .expect(500);

      expect(response.body.error).toBe('Internal Server Error');
      expect(response.body.message).toBe('Something went wrong. Please try again later.');
      expect(response.body.stack).toBeUndefined();
      expect(response.text).not.toContain('sensitive info');
    });

    it('should handle async errors without crashing', async () => {
      app.get('/async-error', async (req, res, next) => {
        try {
          throw new Error('Async operation failed');
        } catch (error) {
          next(error);
        }
      });

      app.use((err, req, res, next) => {
        res.status(500).json({ error: 'Server error' });
      });

      const response = await request(app)
        .get('/async-error')
        .expect(500);

      expect(response.body.error).toBe('Server error');
    });
  });

  describe('Critical Request Validation', () => {
    it('should validate and sanitize URL parameters', async () => {
      app.get('/api/user/:id', (req, res) => {
        const id = req.params.id;
        
        // Basic validation
        if (!/^\d+$/.test(id)) {
          return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        // Additional security check
        if (id.includes('script') || id.includes('union') || id.includes('select')) {
          return res.status(400).json({ error: 'Invalid characters in ID' });
        }
        
        res.json({ userId: id });
      });

      // Test with valid ID
      await request(app)
        .get('/api/user/123')
        .expect(200);

      // Test with SQL injection attempt
      const response1 = await request(app)
        .get('/api/user/1%27%20OR%20%271%27=%271')
        .expect(400);

      expect(response1.body.error).toBe('Invalid user ID format');

      // Test with script injection
      const response2 = await request(app)
        .get('/api/user/script')
        .expect(400);

      expect(response2.body.error).toBe('Invalid characters in ID');
    });

    it('should prevent NoSQL injection attempts', async () => {
      app.post('/api/search', (req, res) => {
        const { query } = req.body;
        
        // Check for NoSQL injection patterns
        if (typeof query === 'object' && query !== null) {
          return res.status(400).json({ error: 'Invalid query format' });
        }
        
        if (typeof query === 'string' && (
          query.includes('$where') ||
          query.includes('$ne') ||
          query.includes('$gt') ||
          query.includes('$regex')
        )) {
          return res.status(400).json({ error: 'Invalid query operators' });
        }
        
        res.json({ results: [] });
      });

      // Test with NoSQL injection object
      const response1 = await request(app)
        .post('/api/search')
        .send({ query: { $ne: null } })
        .expect(400);

      expect(response1.body.error).toBe('Invalid query format');

      // Test with NoSQL injection string
      const response2 = await request(app)
        .post('/api/search')
        .send({ query: 'test $where: function() { return true; }' })
        .expect(400);

      expect(response2.body.error).toBe('Invalid query operators');
    });
  });

  describe('Critical Authentication Security', () => {
    it('should require authentication for protected endpoints', async () => {
      const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
          return res.status(401).json({ error: 'Access token required' });
        }

        // Simple token validation (in real app, verify JWT)
        if (token !== 'valid-token') {
          return res.status(403).json({ error: 'Invalid or expired token' });
        }

        next();
      };

      app.get('/api/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Protected resource accessed' });
      });

      // Test without token
      const response1 = await request(app)
        .get('/api/protected')
        .expect(401);

      expect(response1.body.error).toBe('Access token required');

      // Test with invalid token
      const response2 = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response2.body.error).toBe('Invalid or expired token');

      // Test with valid token
      await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
    });

    it('should implement proper session management', async () => {
      const sessions = new Map();

      app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        
        if (username === 'admin' && password === 'password') {
          const sessionId = Math.random().toString(36).substring(7);
          const sessionData = {
            userId: 1,
            username: 'admin',
            createdAt: Date.now(),
            lastActivity: Date.now()
          };
          
          sessions.set(sessionId, sessionData);
          
          res.json({ 
            message: 'Login successful',
            sessionId: sessionId 
          });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });

      app.post('/api/logout', (req, res) => {
        const { sessionId } = req.body;
        
        if (sessions.has(sessionId)) {
          sessions.delete(sessionId);
          res.json({ message: 'Logout successful' });
        } else {
          res.status(400).json({ error: 'Invalid session' });
        }
      });

      // Test login
      const loginResponse = await request(app)
        .post('/api/login')
        .send({ username: 'admin', password: 'password' })
        .expect(200);

      const sessionId = loginResponse.body.sessionId;
      expect(sessionId).toBeDefined();

      // Test logout
      await request(app)
        .post('/api/logout')
        .send({ sessionId })
        .expect(200);
    });
  });
});