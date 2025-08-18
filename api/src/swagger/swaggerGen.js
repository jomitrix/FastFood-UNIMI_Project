const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Fast-Food API',
    description: 'API documentation for the Fast-Food application',
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['../app.js'];

swaggerAutogen(outputFile, routes, doc);