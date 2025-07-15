const webhook_example = require('./resources/webhook_example.json');
const fs = require('fs');
const { removeInvalidValues } = require('./utils');

function formatOrder(sourceJson, tenant) {
    
    
    const sourceData = sourceJson.data;

    if (!sourceData) {
        throw new Error('Formato inválido de JSON');
    }
    
    if (!tenant || tenant === undefined) {
        throw new Error('Tenant not found in config');
    }
   
    const buyer = sourceData.buyer;
    const address = buyer.address;
    const purchase = sourceData.purchase;
    const product = sourceData.product;
    const order_date = new Date(sourceJson.creation_date).toISOString().split('T')[0];
    
    const paymentMethod = purchase.payment === 'CREDIT_CARD' ? tenant.creditCardCode : tenant.pixCode;
    const paymentPlan = `${paymentMethod}-${purchase.payment.installments_number}`;
    

    const apiPayload = {
        "date": order_date,
        "coupon": purchase.offer.code,
        "observation": `Pedido importado Hotmart - ${purchase.transaction}`,
        "items": [
            { "product_id": tenant.products[product.id], "quantity": "1" }
        ],
        "customer": {
            "email": buyer.email,
            "identification": buyer.document,
            "name": buyer.name,
            "neighborhood": address.neighborhood,
            "phone": buyer.checkout_phone,
            "street": address.address,
            "number": address.number,
            "zipcode": address.zipcode,
            "state": address.state,
            "city": address.city
        },
        "payments": [
            {
                "gateway": purchase.invoice_by === "HOTMART" ? "Hotmart" : "Outro",
                "gateway_id": purchase.transaction,
                "payment_plan_id": paymentPlan,
                "amount": purchase.price.value,
                "status": "paid"
            }
        ]
    };
    // console.log('Payload formatado:', removeInvalidValues(apiPayload));
    return removeInvalidValues(apiPayload);
};

// formatOrder(webhook_example, config['coyo.staging']);


module.exports = formatOrder;

//TODO:

/*
[ ] Verificar se o campo invoice_by é igual a hotmart, caso contrário retornar erro
[ ] Verificar se o campo price.value é um número e converter para string
[ ] Verificar se o campo buyer.checkout_phone é um número válido, SEN, flagear o estado como NA
[ ] Ignorar todos os dados do buyer e trabalhar apenas com o email
[ ] Realizar o de para do id do produto para o id da api (5345772 - Jobnagringa / 4533345 - Felipe Fontoura)
[ ] realizar o de para do plano de pagamento  para o plano de origem
[x] remover o checkout_page_id se não for necessário
*/