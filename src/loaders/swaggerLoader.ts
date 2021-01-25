import * as swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerComponents from '../../docs/swagger.components';
import swaggerTags from '../../docs/swagger.tags';

export default (app: any) => {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Sales Executive Api',
        version: '1.0.0',
        description: 'Api for sales executive mobile app',
        contact: {
          name: 'Maneksh M S',
        },
      },
      components: swaggerComponents,
      tags: swaggerTags,
    },
    apis: ['./src/controllers/*.ts'],
  };

  const swaggerDocs: any = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
