const express = require('express');
const formattOrder = require('./formatOrder');
const callApi = require('./call_api');

const app = express();

app.use(express.json());




app.post('/api/v1/order', async (req, res) => {
  const orderPayload = req.body;
  const formattedData = formattOrder(orderPayload);

  try {
    const apiResponse = await callApi(formattedData);
    res.status(200).json({ message: 'Order processed', apiResponse });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao chamar a API', error: err.message });
  }
});


if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
