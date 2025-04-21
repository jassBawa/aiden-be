import { ENV_CONFIG } from '@/config/env.config';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aiden Backend Api Docs',
      version: '1.0.0',
      description: 'API documentation for your Express app',
    },
    servers: [
      {
        url: ENV_CONFIG.PROD_API_URL,
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
