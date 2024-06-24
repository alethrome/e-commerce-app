const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce App',
            version: '1.0.0',
            description: 'API documentation for E-commerce app',
        },
    },
    apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
