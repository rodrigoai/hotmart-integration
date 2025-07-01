
function formatOrder(sourceJson) {
    
    
    const sourceData = sourceJson.data;

    if (!sourceData) {
    throw new Error('Formato inválido de JSON');
    }
    
   
    const buyer = sourceData.buyer;
    const address = buyer.address;
    const purchase = sourceData.purchase;
    const product = sourceData.product;
    const crmInfo = {};

    // Constrói o novo objeto JSON com os dados extraídos e formatados
    const apiPayload = {
        "coupon": "", // Campo fixo, conforme o exemplo
        "items": [
            {
                "product_id": 36,
                "quantity": 1 // Quantidade fixa
            }
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
        "crm_info": crmInfo, 
        "payments": [
            {
                // Mapeia o 'invoice_by' para o nome do gateway.
                // Você pode adicionar mais lógicas aqui se houver outros gateways.
                "gateway": purchase.invoice_by === "HOTMART" ? "Hotmart" : "Outro",
                "gateway_id": purchase.transaction,
                "payment_plan_id": "2-1",
                // Converte o valor para string, como no exemplo.
                "amount": String(purchase.price.value)
            }
        ]
    };

    console.log('Payload formatado para a API:', JSON.stringify(apiPayload, null, 2));
    return apiPayload;
};

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