import { Schema } from 'mongoose';
export default {
  getAllMunicipalitiesResponse: {
    description: 'All Municipalites',
    content: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/municipality',
      },
    },
  },

  // get all inventories response
  getAllInventoriesResponse: {
    description: 'All Inventories',
    content: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/inventory',
      },
    },
  },

  // get all customer inventories response
  getAllCustomerInventoriesResponse: {
    description: 'All Inventories',
    content: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/customerInventories',
      },
    },
  },

  /* ####################################### CUSTOMER #######################################/ */

  // get all Customer response
  getAllCustomersResponse: {
    description: 'All Customers Created by the sales executive will be listed here',
    content: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/customers',
      },
    },
  },

  // get all customer type response
  getAllCustomerTypesRespose: {
    description: 'All Customer types',
    content: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/customerTypes',
      },
    },
  },

  // Create Customer response
  createCustomerResponse: {
    description: 'Create customer response',
    content: 'application/json',
    schema: {
      type: 'object',
      $ref: '#/components/schemas/customers',
    },
  },
};
