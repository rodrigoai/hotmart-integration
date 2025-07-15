const express = require('express');
const formatOrder = require('./formatOrder'); 
const callApi = require('./callApi'); 
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const parseCsvToJson = require('./parseCsvToJson');
const rawData = fs.readFileSync('config.json');
const config = JSON.parse(rawData);

const app = express();

// Ensure csv_files directory exists
if (!fs.existsSync('csv_files')) {
  fs.mkdirSync('csv_files', { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'csv_files/')
  },
  filename: function (req, file, cb) {
    // Keep original filename with timestamp prefix
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only accept CSV files
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(express.json());
app.use(express.static('public'));

// Upload CSV file endpoint
app.post('/api/v1/upload-csv', upload.single('csvFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// List uploaded files endpoint
app.get('/api/v1/files', (req, res) => {
  try {
    const files = fs.readdirSync('csv_files')
      .filter(file => file.endsWith('.csv'))
      .map(file => {
        const filePath = path.join('csv_files', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          uploadDate: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // Sort by upload date, newest first
    
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: 'File upload error', error: error.message });
  }
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

app.post('/api/v1/order', async (req, res) => {
  const orderPayload = req.body;
  const formattedData = formatOrder(orderPayload, config["coyo.staging"]);
  try {
    const bearerToken = req.header('Authorization').replace('Bearer ', '');
    res.header('Content-Type', 'application/json');

    const apiResponse = await callApi(formattedData, config["coyo.staging"], bearerToken);
    res.status(200).json({ message: 'Order processed', apiResponse });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao chamar a API', error: err.message, formattedData });
  }
});


app.post('/api/v1/importCSV', async (req, res) => {
  const bearerToken = req.header('Authorization').replace('Bearer ', '');
  res.header('Content-Type', 'application/json');
  const { csvFilePath, jsonFilePath, env } = req.body;
  try {
    const result = await parseCsvToJson(csvFilePath, jsonFilePath, config[env]);
    if (req.body.callApi) {
      await callApi(result, config[env], bearerToken);
    }
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
