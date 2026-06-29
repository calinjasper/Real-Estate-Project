module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Real Estate Listing Platform API',
    version: '1.0.0',
    description: 'API documentation for Real Estate Listing Platform',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Properties',
      description: 'Property management endpoints',
    },
    {
      name: 'Inquiries',
      description: 'Inquiry management endpoints',
    },
  ],
};
