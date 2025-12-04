const fs = require('fs');
const csv = require('csv-parser');
const { formatDateToYYYYMMDD, removeInvalidValues } = require('./utils');


function parseCsvToJson(csvFilePath, jsonFilePath, tenant) {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!fs.existsSync(csvFilePath)) {
      const errorMsg = `Error: Input file not found at ${csvFilePath}`;
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {


        const paymentMethod = row['Método de pagamento'] === 'Pix' ? tenant.pixCode : tenant.creditCardCode;
        const paymentPlan = `${paymentMethod}-${row['Quantidade total de parcelas']}`;

        const formattedJson = {
          date: formatDateToYYYYMMDD(row['Data da transação']),
          coupon: row['Código de cupom'],
          observation: `Pedido importado Hotmart`,
          customer: {
            email: (row['Email do(a) Comprador(a)'] === '(none)' || row['Email do(a) Comprador(a)'] === undefined || row['Email do(a) Comprador(a)'] === null) ? 'nomail@nomail.com' : row['Email do(a) Comprador(a)'],
            identification: (row.Documento && row.Documento.length >= 11) ? row.Documento : '(none)',
            name: (row['Comprador(a)'] === '(none)' || row['Comprador(a)'] === undefined || row['Comprador(a)'] === null) ? 'N/I' : row['Comprador(a)'],
            neighborhood: row.Bairro,
            number: row['Número'],
            phone: (row.phone === '(none)' || row.phone === undefined || row.phone === null) ? '5511999999999' : row.phone,
            street: row['Endereço'],
            zipcode: row['Código postal'],
            state: row['Estado'],
            city: row.Cidade,
          },
          items: [
            { product_id: tenant.products[row['Código do produto']], quantity: row['Quantidade de itens'] }
          ],
          payments: [
            {
              gateway: 'Hotmart',
              gateway_id: row[Object.keys(row)[0]],
              payment_plan_id: paymentPlan,
              amount: row['Valor de compra com impostos'],
              status: "paid",
            }
          ]
        };
        results.push(removeInvalidValues(formattedJson));


      })
      .on('end', () => {
        fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
          if (err) {
            console.error('Error writing JSON file:', err);
            reject(err);
          } else {
            console.log(`✅ Successfully converted ${results.length} rows and saved to ${jsonFilePath}`);
            resolve(results);
          }
        });
      })
      .on('error', (error) => {
        console.error('❌ Error reading or parsing CSV file:', error);
        reject(error);
      });
  });
}

module.exports = parseCsvToJson;