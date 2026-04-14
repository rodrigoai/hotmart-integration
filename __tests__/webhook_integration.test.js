const formatOrder = require('../formatOrder');
const webhook_example = require('../resources/webhook_example.json');
const fs = require('fs');

describe('Webhook Payload Transformation', () => {
    let config;

    beforeAll(() => {
        const rawData = fs.readFileSync('config.json');
        config = JSON.parse(rawData);
    });

    it('should correctly format the actual webhook_example.json payload', () => {
        const tenant = config['jobnagringa'];
        const result = formatOrder(webhook_example, tenant);

        // Verify the transformation based on webhook_example.json
        expect(result.date).toBe('2025-06-16'); // creation_date: 1750078392425 is 2025-06-16
        expect(result.observation).toContain('HP0365453131'); // purchase.transaction
        expect(result.customer.email).toBe('hgbonatto@gmail.com');
        expect(result.customer.identification).toBe('09266617954');
        expect(result.items[0].product_id).toBe('36'); // product id 5345772 maps to 36 in config for jobnagringa
        
        // Payment verification - this was the fixed part
        expect(result.payments[0].payment_plan_id).toBe('3-4'); // creditCardCode=3, installments=4
        expect(result.payments[0].amount).toBe(497);
        expect(result.payments[0].status).toBe('paid');
    });

    it('should throw error if tenant is missing', () => {
        expect(() => formatOrder(webhook_example, null)).toThrow('Tenant not found in config');
    });

    it('should throw error if payload is invalid', () => {
        expect(() => formatOrder({}, config['jobnagringa'])).toThrow('Formato inválido de JSON');
    });
});
