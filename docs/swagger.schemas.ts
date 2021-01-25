export default {
  // authData for login
  authData: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        example: 'aid00xxx',
      },
      password: {
        type: 'string',
        example: 'password',
      },
    },
  },

  // authResponse
  authResponse: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '5ed739c6e6a1b21622a70f9c',
          },
          userId: {
            type: 'string',
            example: 'aid000xxx',
          },
          name: {
            type: 'string',
            example: 'Foo',
          },
          email: {
            type: 'string',
            example: 'Foo@gmail.com',
          },
          phoneNumber: {
            type: 'string',
            example: '782838828388',
          },
          role: {
            type: 'string',
            example: 'SALESMAN',
          },
        },
      },
      token: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWE2YzQ4YTM3MWNiMDAxZDIwM2MyNyIsImlhdCI6MTU5NjAxNzQ3MiwiZXhwIjoxNTk2MDIxMDcyfQ.I0pjTcZ-iRDg3pbeMgpD0D29yGs94PXzgO3L5-Ewg4w',
          },
          refreshToken: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWE2YzQ4YTM3MWNiMDAxZDIwM2MyNyIsImlhdCI6MTU5NjAxNzQ3MiwiZXhwIjoxNTk2MDIxMDcyfQ.I0pjTcZ-iRDg3pbeMgpD0D29yGs94PXzgO3L5-Ewg4w',
          },
        },
      },
    },
  },

  // refreshTokenParam
  refreshTokenPrams: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWE2YzQ4YTM3MWNiMDAxZDIwM2MyNyIsImlhdCI6MTU5NjAxNzQ3MiwiZXhwIjoxNTk2MDIxMDcyfQ.I0pjTcZ-iRDg3pbeMgpD0D29yGs94PXzgO3L5-Ewg4w',
      },
    },
  },

  // refreshTokenResponse
  refreshTokenResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWE2YzQ4YTM3MWNiMDAxZDIwM2MyNyIsImlhdCI6MTU5NjAxNzQ3MiwiZXhwIjoxNTk2MDIxMDcyfQ.I0pjTcZ-iRDg3pbeMgpD0D29yGs94PXzgO3L5-Ewg4w',
      },
    },
  },

  municipality: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2d',
        description: 'Unique id of municipality',
      },
      name: {
        type: 'string',
        example: 'Doha',
        description: 'Municipality name',
      },
    },
  },

  inventory: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2d',
        description: 'Unique id of inventory',
      },
      name: {
        type: 'string',
        example: 'Pump',
        description: 'Inventory name',
      },
      serialNumber: {
        type: 'string',
        example: '3453643',
        description: 'Serial number of the inventory, It is unique',
      },
      price: {
        type: 'string',
        example: '73.3',
        description: 'Price of the inventory',
      },
      inventoryType: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2c',
        description: 'Inventory type id',
      },
      company: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2x',
        description: 'Company Id',
      },
      isAvailable: {
        type: 'boolean',
        example: 'true',
        description: 'true means available, false if not',
      },
    },
  },

  customerInventories: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2d',
        description: 'Unique id of Customer inventory',
      },
      isActive: {
        type: 'boolean',
        example: 'true',
        description: 'True if active false if not active',
      },
      isPaid: {
        type: 'boolean',
        example: 'true',
        description: 'True if paid else not paid',
      },
      customerId: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2r',
        description: 'Customer Id',
      },
      issuedAt: {
        type: 'string',
        example: '2020-06-03T20:07:12.173Z',
        description: 'ISO 8601 date',
      },
      orderId: {
        type: 'string',
        example: '5eb8e08feeef341222a991c2r',
        description: 'Order Id if paid',
      },
      inventory: {
        type: 'object',
        properties: {
          isAvailable: {
            type: 'boolean',
            example: 'true',
          },
          name: {
            type: 'string',
            example: 'Water Pulp',
            description: 'Name of the inventory',
          },
          serialNumber: {
            type: 'string',
            example: '3453643',
            description: 'Serial number of the inventory, It is unique',
          },
          price: {
            type: 'string',
            example: '73.3',
            description: 'Price of the inventory',
          },
          inventoryType: {
            type: 'string',
            example: '5eb8e08feeef841222a991c2c',
            description: 'Inventory type id',
          },
          company: {
            type: 'string',
            example: '5eb8e08feeef841222a991c2x',
            description: 'Company Id',
          },
          description: {
            type: 'string',
            example: 'Some description',
          },
        },
      },
    },
  },

  /* ############################################### CUSTOMERS ################################ */

  // customers
  customers: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '5eb8e08feeef841222a991c2d',
        description: 'Unique id of Customer',
      },
      name: {
        type: 'string',
        example: 'John Doe',
        description: 'Name of the customer',
      },
      customerId: {
        type: 'string',
        example: 'acid0001',
        description: 'Generated customer id, this customer id will be used for login customer app',
      },
      customerTypeId: {
        type: 'string',
        example: '5eb8e08feeef841222a9916wd2',
        description: 'Customer type id',
      },
      email: {
        type: 'string',
        example: 'foo@gmail.com',
        description: 'Email id of the user, Email is unique',
      },
      phoneNumber: {
        type: 'string',
        example: '83743859585',
        description: 'Phone number of the customer',
      },
      couponDiscount: {
        type: 'number',
        example: '5',
        description: 'Coupon discount for the customer, while purchasing the coupon this percentage will be reduced from the amount',
      },
      coupons: {
        type: 'number',
        example: '15',
        description: 'Coupons available for the customers, using this coupons customers can request water bottles',
      },
      isActive: {
        type: 'boolean',
        example: 'true',
        description:
          'If true customer is activated else not activated, once customer is created by sales executive administrater should activate the customer',
      },
      termsAndConditionsAccepted: {
        type: 'boolean',
        example: 'true',
        description:
          'If terms and conditions are accepted then true else false, when customer login for first fime he has to accept terms and conditions',
      },
      address: {
        type: 'object',
        properties: {
          municipalityId: {
            type: 'string',
            example: '5eb8e0fee23841222a991c2d',
            description: 'Municipality id',
          },
          zone: {
            type: 'stirng',
            example: 'Al Jasra',
            description: 'Zone name',
          },
          street: {
            type: 'string',
            example: 'Al Markhiya',
            description: 'Street name',
          },
          buildingNumber: {
            type: 'string',
            example: '25',
            description: 'Building number',
          },
          flatNumber: {
            type: 'string',
            example: '12 BAZ',
            description: 'Flat number',
            required: false,
          },
          floorNumber: {
            type: 'string',
            example: '12',
            description: 'Floor number',
            required: false,
          },
        },
      },
      locations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            municipalityId: {
              type: 'string',
              example: '5eb8e0fee23841222a991c2d',
              description: 'Municipality id',
            },
            zone: {
              type: 'stirng',
              example: 'Al Jasra',
              description: 'Zone name',
            },
            street: {
              type: 'string',
              example: 'Al Markhiya',
              description: 'Street name',
            },
            buildingNumber: {
              type: 'string',
              example: '25',
              description: 'Building number',
            },
            flatNumber: {
              type: 'string',
              example: '12 BAZ',
              description: 'Flat number',
              required: false,
            },
            floorNumber: {
              type: 'string',
              example: '12',
              description: 'Floor number',
              required: false,
            },
            coordinates: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'string',
                  example: '11.124976',
                  description: 'Latitude of location',
                },
                longitude: {
                  type: 'string',
                  example: '76.0063087',
                  description: 'Longitude of location',
                },
              },
            },
          },
        },
      },
    },
  },

  createCustomerData: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Foo Bar',
        description: 'Customer name',
      },
      phoneNumber: {
        type: 'string',
        example: '25326346453',
        description: 'Customer phone number',
      },
      email: {
        type: 'string',
        example: 'foobar@gmail.com',
        description: 'Customer email id',
      },
      customerTypeId: {
        type: 'string',
        example: '5eb8e223eef841222a991c2f',
        description: 'Customer type id',
      },
      address: {
        type: 'object',
        properties: {
          municipalityId: {
            type: 'string',
            example: '5eb8e0fee23841222a991c2d',
            description: 'Municipality id',
          },
          zone: {
            type: 'stirng',
            example: 'Al Jasra',
            description: 'Zone name',
          },
          street: {
            type: 'string',
            example: 'Al Markhiya',
            description: 'Street name',
          },
          buildingNumber: {
            type: 'string',
            example: '25',
            description: 'Building number',
          },
          flatNumber: {
            type: 'string',
            example: '12 BAZ',
            description: 'Flat number',
            required: false,
          },
          floorNumber: {
            type: 'string',
            example: '12',
            description: 'Floor number',
            required: false,
          },
        },
      },
      locations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            municipalityId: {
              type: 'string',
              example: '5eb8e0fee23841222a991c2d',
              description: 'Municipality id',
            },
            zone: {
              type: 'stirng',
              example: 'Al Jasra',
              description: 'Zone name',
            },
            street: {
              type: 'string',
              example: 'Al Markhiya',
              description: 'Street name',
            },
            buildingNumber: {
              type: 'string',
              example: '25',
              description: 'Building number',
            },
            flatNumber: {
              type: 'string',
              example: '12 BAZ',
              description: 'Flat number',
              required: false,
            },
            floorNumber: {
              type: 'string',
              example: '12',
              description: 'Floor number',
              required: false,
            },
            coordinates: {
              type: 'string',
              example: '-50.59067,23.79085',
              description: 'Coordinates of user location',
            },
          },
        },
      },
    },
  },

  // customerTypes

  customerTypes: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '5eb8e0fee23841222a992354df',
        description: 'Id of customer types',
      },
      type: {
        type: 'string',
        example: 'Cash Customer',
      },
    },
  },
};
