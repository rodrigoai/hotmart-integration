const formatOrder = require('../formatOrder');
const webhook_example = require('../resources/webhook_example.json');
const fs = require('fs');

describe('formatOrder', () => {

    const rawData = fs.readFileSync('config.json');
    const config = JSON.parse(rawData);

  const mockInput = {
    data: {
      buyer: {
        name: 'John Doe',
        email: 'john@example.com',
        document: '508.363.410-40',
        checkout_phone: '12998882882',
        address: {
          neighborhood: 'Downtown',
          address: '123 Main St',
          number: '45B',
          zipcode: '12235000',
          state: 'SP',
          city: 'São José dos Campos'
        }
      },
      purchase: {
        invoice_by: 'HOTMART',
        transaction: 'txn123',
        price: {
          value: 497
        }
      },
      product: {
        id: 36
      }
    }
  };

  it('should retrieve a message when a tenant doesnt exist in the config', () => {

    const tenant = config['teste.staging'];
    expect(() => formatOrder(mockInput, tenant)).toThrow('Tenant not found in config');
    

  });

});

