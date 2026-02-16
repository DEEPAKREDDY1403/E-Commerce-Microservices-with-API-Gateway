const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Gateway',
      version: '1.0.0',
      description: 'Centralized API Gateway for E-Commerce Microservices',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'API Gateway',
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
        name: 'Products',
        description: 'Product management endpoints',
      },
    ],
  },
  apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
