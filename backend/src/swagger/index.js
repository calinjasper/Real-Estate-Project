const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDef = require('./swaggerDef');

const options = {
  definition: swaggerDef,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
