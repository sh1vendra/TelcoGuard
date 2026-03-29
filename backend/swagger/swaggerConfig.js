const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TelcoGuard API',
      version: '1.0.0',
      description: 'Telecom number management and fraud detection API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'secret123' },
            role: { type: 'string', enum: ['admin', 'operator', 'viewer'], example: 'operator' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@telcoguard.com' },
            password: { type: 'string', example: 'admin1234' },
          },
        },
        PhoneNumberInput: {
          type: 'object',
          required: ['number'],
          properties: {
            number: { type: 'string', example: '+12025551234' },
            type: { type: 'string', enum: ['local', 'toll-free', 'mobile', 'voip'], example: 'local' },
            status: { type: 'string', enum: ['available', 'assigned', 'porting', 'suspended', 'flagged'] },
            carrier: { type: 'string', example: 'AT&T' },
            assignedTo: { type: 'string', example: 'customer-001' },
            notes: { type: 'string' },
          },
        },
        PortingInput: {
          type: 'object',
          required: ['phoneNumber', 'fromCarrier', 'toCarrier'],
          properties: {
            phoneNumber: { type: 'string', example: '64b1f2e3c4d5a6b7c8d9e0f1' },
            fromCarrier: { type: 'string', example: 'Verizon' },
            toCarrier: { type: 'string', example: 'T-Mobile' },
            notes: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
