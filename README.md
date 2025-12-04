# Hotmart Plugin - Nova.Money Integration

A Node.js/Express integration service that connects **Hotmart** (digital product sales platform) with **Nova.Money** (payment management system). This plugin transforms and imports order data from Hotmart into the Nova.Money platform.

## 📋 Features

- ✅ **Real-time Webhook Integration** - Process Hotmart purchase events as they happen
- ✅ **CSV Batch Import** - Import historical orders from Hotmart CSV exports
- ✅ **Web Upload Interface** - User-friendly interface for uploading and managing CSV files
- ✅ **Multi-tenant Support** - Configure multiple environments (production, staging)
- ✅ **Automatic Data Transformation** - Maps Hotmart data to Nova.Money's API format
- ✅ **Payment Method Mapping** - Supports Credit Card and PIX payments with installments

## 🚀 How to Start/Run

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- Valid **Nova.Money API credentials**

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /path/to/hotmart-plugin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your environment**:
   - Edit `config.json` with your tenant-specific settings:
     - API keys for Nova.Money
     - Product ID mappings
     - Payment method codes
     - Environment URLs

### Starting the Server

**Development Mode:**
```bash
node index.js
```

The server will start on **port 3000** by default.

**Custom Port:**
```bash
PORT=8080 node index.js
```

**Expected Output:**
```
Server running on port 3000
```

### Accessing the Application

Once started, you can access:

- **Upload Interface**: [http://localhost:3000/upload.html](http://localhost:3000/upload.html)
- **API Endpoints**: `http://localhost:3000/api/v1/*`

## 📡 API Endpoints

### 1. Process Webhook Order
Receives real-time webhooks from Hotmart when purchases occur.

**Endpoint:** `POST /api/v1/order`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {YOUR_API_KEY}
```

**Body:** Hotmart webhook payload (see `resources/webhook_example.json`)

**Response:**
```json
{
  "message": "Order processed",
  "apiResponse": [...]
}
```

---

### 2. Import CSV File
Batch import orders from a CSV file.

**Endpoint:** `POST /api/v1/importCSV`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {YOUR_API_KEY}
```

**Body:**
```json
{
  "csvFilePath": "csv_files/2025-12-04T12-00-00-000Z_orders.csv",
  "jsonFilePath": "output.json",
  "env": "coyo.staging",
  "callApi": true
}
```

**Parameters:**
- `csvFilePath` - Path to the CSV file in the `csv_files/` directory
- `jsonFilePath` - Output JSON file path
- `env` - Environment key from `config.json` (`jobnagringa` or `coyo.staging`)
- `callApi` - `true` to send to Nova.Money API, `false` to only convert

---

### 3. Upload CSV File
Upload a CSV file via the web interface.

**Endpoint:** `POST /api/v1/upload-csv`

**Content-Type:** `multipart/form-data`

**Field:** `csvFile` (max 10MB)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "2025-12-04T12-00-00-000Z_orders.csv",
  "originalName": "orders.csv",
  "size": 12345,
  "path": "csv_files/2025-12-04T12-00-00-000Z_orders.csv"
}
```

---

### 4. List Uploaded Files
Get a list of all uploaded CSV files.

**Endpoint:** `GET /api/v1/files`

**Response:**
```json
[
  {
    "name": "2025-12-04T12-00-00-000Z_orders.csv",
    "size": 12345,
    "uploadDate": "2025-12-04T15:00:00.000Z"
  }
]
```

## ⚙️ Configuration

Edit `config.json` to configure your tenants:

```json
{
  "your-tenant-name": {
    "apiKey": "YOUR_NOVA_MONEY_API_KEY",
    "creditCardCode": "1",
    "pixCode": "2",
    "env": "your.environment",
    "products": {
      "HOTMART_PRODUCT_ID": "NOVA_PRODUCT_ID"
    }
  }
}
```

**Configuration Fields:**
- `apiKey` - Nova.Money API authentication key
- `creditCardCode` - Payment method code for credit card
- `pixCode` - Payment method code for PIX
- `env` - Nova.Money environment subdomain
- `products` - Mapping of Hotmart product IDs to Nova.Money product IDs

## 📊 Data Transformation

The plugin automatically maps Hotmart data to Nova.Money format:

| Hotmart Field | Nova.Money Field |
|---------------|------------------|
| `buyer.email` | `customer.email` |
| `buyer.name` | `customer.name` |
| `buyer.document` | `customer.identification` |
| `buyer.address.*` | `customer.street/city/state/zipcode` |
| `purchase.transaction` | `payments[].gateway_id` |
| `purchase.price.value` | `payments[].amount` |
| `product.id` | `items[].product_id` (mapped) |

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📁 Project Structure

```
hotmart-plugin/
├── index.js                 # Main Express server
├── formatOrder.js          # Webhook payload transformation
├── parseCsvToJson.js       # CSV to JSON converter
├── callApi.js              # Nova.Money API client
├── utils.js                # Helper functions
├── config.json             # Tenant configuration
├── public/
│   └── upload.html         # Web upload interface
├── resources/
│   └── webhook_example.json # Sample webhook payload
└── csv_files/              # Uploaded CSV storage
```

## 🔧 Troubleshooting

### Server won't start
- Ensure port 3000 is not in use by another application
- Check that all dependencies are installed (`npm install`)

### CSV upload fails
- Verify file is a valid CSV (`.csv` extension)
- Check file size is under 10MB
- Ensure `csv_files/` directory exists (created automatically)

### API calls fail
- Verify API keys in `config.json` are correct
- Check network connectivity to Nova.Money servers
- Ensure `Authorization` header is properly formatted

## 📝 Additional Documentation

- [CSV Upload Interface Guide](README_CSV_UPLOAD.md)
- Webhook Example: `resources/webhook_example.json`
- Nova Order Format: `resources/nova_order_call_example.json`

## 👤 Author

**Rodrigo Lima**

## 📄 License

ISC
