const formatOrder = require('../formatOrder');

describe('formatOrder', () => {
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

  it('should return a valid payload when the input JSON is correct', () => {
    const result = formatOrder(mockInput);
    expect(result.customer.name).toBe('John Doe');
    expect(result.payments[0].gateway).toBe('Hotmart');
    expect(result.payments[0].amount).toBe('197');
    expect(result.items[0].product_id).toBe(36);
  });

  it('should throw an error if sourceJson.data is missing', () => {
    expect(() => formatOrder({})).toThrow('Json Inválido');
  });

  it('should return error if invoice_by is not HOTMART', () => {
    const modifiedInput = JSON.parse(JSON.stringify(mockInput));
    modifiedInput.data.purchase.invoice_by = 'PAGSEGURO';
    const result = formatOrder(modifiedInput);
    expect(result.payments[0].gateway).toBe('error');
  });

  it('should convert the price value to a string', () => {
    const result = formatOrder(mockInput);
    expect(typeof result.payments[0].amount).toBe('string');
    expect(result.payments[0].amount).toBe('197');
  });
});
