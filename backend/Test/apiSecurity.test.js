const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Create a simple test app for security testing
const createTestApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Mock routes for testing
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check for SQL injection patterns
    const sqlInjectionPatterns = [
      /['";]/,
      /(\bOR\b|\bAND\b).*[=<>]/i,
      /UNION.*SELECT/i,
      /DROP.*TABLE/i,
      /INSERT.*INTO/i,
      /UPDATE.*SET/i,
      /DELETE.*FROM/i
    ];

    const isSQLInjection = sqlInjectionPatterns.some(pattern => 
      pattern.test(email) || pattern.test(password)
    );

    if (isSQLInjection) {
      return res.status(400).json({ message: 'Invalid input detected' });
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script.*?>.*?<\/script>/i,
      /<.*?on\w+.*?=.*?>/i,
      /javascript:/i,
      /<iframe.*?>/i,
      /<object.*?>/i,
      /<embed.*?>/i
    ];

    const isXSS = xssPatterns.some(pattern => 
      pattern.test(email) || pattern.test(password)
    );

    if (isXSS) {
      return res.status(400).json({ message: 'Invalid input detected' });
    }

    // Mock successful login
    res.status(200).json({ 
      message: 'Login successful', 
      token: 'mock-token' 
    });
  });

  app.post('/api/properties', (req, res) => {
    const { name, location, price } = req.body;

    // Basic validation
    if (!name || !location || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Security validation
    const dangerousPatterns = [
      /<script.*?>/i,
      /javascript:/i,
      /['";].*?(OR|AND).*?[=<>]/i,
      /UNION.*SELECT/i
    ];

    const hasDangerousInput = dangerousPatterns.some(pattern => 
      pattern.test(name) || pattern.test(location) || pattern.test(String(price))
    );

    if (hasDangerousInput) {
      return res.status(400).json({ message: 'Invalid input detected' });
    }

    res.status(201).json({
      id: 1,
      name,
      location,
      price,
      message: 'Property created successfully'
    });
  });

  // 404 handler
  app.use('/*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
};

describe('Security Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent basic SQL injection in login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: "admin' OR '1'='1", 
          password: "password" 
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should prevent UNION SELECT injection', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: "test@example.com' UNION SELECT * FROM users--", 
          password: "password" 
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should prevent DROP TABLE injection', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: "test@example.com'; DROP TABLE users;--", 
          password: "password" 
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should allow legitimate email addresses', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: "user@example.com", 
          password: "validpassword" 
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });
  });

  describe('XSS Prevention', () => {
    it('should prevent script tag injection', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: "<script>alert('XSS')</script>", 
          password: "password" 
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should prevent event handler injection', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          name: '<img src="x" onerror="alert(\'XSS\')">',
          location: 'Test Location',
          price: 1000
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should prevent javascript: protocol injection', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          name: 'javascript:alert("XSS")',
          location: 'Test Location',
          price: 1000
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input detected');
    });

    it('should allow legitimate property data', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          name: 'Beautiful House',
          location: 'Downtown',
          price: 1500
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Property created successfully');
    });
  });

  describe('Input Validation', () => {
    it('should require email and password for login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });

    it('should require all fields for property creation', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({ name: 'Test Property' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required fields');
    });
  });

  describe('Route Security', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Route not found');
    });

    it('should return 404 for non-existent POST routes', async () => {
      const res = await request(app)
        .post('/api/nonexistent')
        .send({ data: 'test' });
      
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Route not found');
    });

    it('should handle different HTTP methods on unknown routes', async () => {
      const methods = ['put', 'delete', 'patch'];
      
      for (const method of methods) {
        const res = await request(app)[method]('/api/unknown');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Route not found');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(res.status).toBe(400);
    });

    it('should handle empty request body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email and password are required');
    });
  });
});
