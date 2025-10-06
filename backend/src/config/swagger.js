// const swaggerJsdoc = require('swagger-jsdoc');
import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Rental API',
      version: '1.0.0',
      description: 'A comprehensive car rental management API',
      contact: {
        name: 'API Support',
        email: 'support@carrental.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin', 'manager'] },
            isEmailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Car: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'number' },
            category: { type: 'string' },
            transmission: { type: 'string' },
            pricePerDay: { type: 'number' },
            status: { type: 'string' },
            rating: {
              type: 'object',
              properties: {
                average: { type: 'number' },
                count: { type: 'number' },
              },
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            bookingNumber: { type: 'string' },
            user: { type: 'string' },
            car: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
            pricing: {
              type: 'object',
              properties: {
                total: { type: 'number' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;