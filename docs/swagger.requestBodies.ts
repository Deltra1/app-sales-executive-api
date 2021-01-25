export default {
  createCustomerRequestBody: {
    description: 'Create customer request body',
    required: true,
    content: 'application/json',
    schema: {
      $ref: '#/components/schemas/createCustomerData',
    },
  },
};
