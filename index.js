const express = require('express');
const formatOrder = require('./formatOrder'); 
const callApi = require('./callApi'); 

const fs = require('fs');

const parseCsvToJson = require('./parseCsvToJson');

const app = express();

app.use(express.json());

app.post('/api/v1/order', async (req, res) => {
  const orderPayload = req.body;
  const formattedData = formatOrder(orderPayload);

  try {
    const apiResponse = await callApi(formattedData);
    res.status(200).json({ message: 'Order processed', apiResponse });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao chamar a API', error: err.message });
  }
});


app.post('/api/v1/importCSV', async (req, res) => {
  const rawData = fs.readFileSync('config.json');
  const config = JSON.parse(rawData);
  const bearerToken = req.header('Authorization').replace('Bearer ', '');

  console.log('Bearer Token:', bearerToken);

  const { csvFilePath, jsonFilePath, env } = req.body;

  try {

    
    const result = await parseCsvToJson(csvFilePath, jsonFilePath, config[env]);
    await callApi(result, config[env], bearerToken);
    res.status(200).json({ data: result });
  
  } catch (error) {
    res.status(500).json({ message: "Erro ao importar CSV", error: error.message });
  }
});


if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
