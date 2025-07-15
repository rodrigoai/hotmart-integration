async function callApi(data, base, apikey) {
  // If data is not an array, wrap it as an array
  const orders = Array.isArray(data) ? data : [data];
  const results = [];
  for (const order of orders) {
    try {
      console.log('Ambiente:', base.env);
      const response = await fetch(`https://${base.env}.pay.nova.money/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      results.push({ success: true, result });
      console.log('Results:', result, order.payments[0].gateway_id);

    } catch (error) {
      console.error('Erro ao chamar a API - function:', error);
      results.push({ success: false, error: error.message });
    }
  }

  return results;
}

module.exports = callApi;