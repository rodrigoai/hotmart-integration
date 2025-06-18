
 async function callApi(data) {
    try {
      const response = await fetch('https://coyo.staging.pay.nova.money/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer EyXkwuuYmzejxKLzj7cq5xg8Etzyz9hCSV5Mxs6D2r3h3Ya_ZotM9G8h72VEp_QVzFzA2Bso69uiW8-qyMygkNyw9SiSzTXn1Ewd'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('Sucesso:', result);
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
    }
  }

  module.exports = callApi;