# CSV File Upload Interface

This interface allows you to upload CSV files to the `csv_files` folder through a web interface.

## Features

- **Web Interface**: Clean and intuitive HTML interface for uploading CSV files
- **File Validation**: Only accepts CSV files (validates both MIME type and file extension)
- **File Size Limit**: Maximum file size of 10MB
- **Automatic Naming**: Uploaded files are prefixed with timestamp to avoid conflicts
- **File Listing**: View all uploaded files with their sizes and upload dates
- **Real-time Feedback**: Success/error messages and upload progress

## How to Use

### 1. Start the Server

```bash
npm start
# or
node index.js
```

The server will start on port 3000 by default.

### 2. Access the Upload Interface

Open your web browser and navigate to:
```
http://localhost:3000/upload.html
```

### 3. Upload CSV Files

1. Click "Choose File" and select a CSV file from your computer
2. Click "Upload CSV File"
3. The file will be uploaded to the `csv_files/` directory
4. You'll see a success message and the file will appear in the "Uploaded Files" list

### 4. View Uploaded Files

The interface automatically displays all uploaded CSV files with:
- File name (with timestamp prefix)
- File size in bytes
- Upload date and time

Files are sorted by upload date (newest first).

## API Endpoints

The interface uses the following API endpoints:

### Upload CSV File
- **POST** `/api/v1/upload-csv`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `csvFile`
- **Response**: JSON with file information

### List Uploaded Files
- **GET** `/api/v1/files`
- **Response**: JSON array of file information

## File Storage

- Files are stored in the `csv_files/` directory
- Original filenames are preserved but prefixed with a timestamp
- Format: `YYYY-MM-DDTHH-MM-SS-sssZ_originalname.csv`

## Error Handling

The interface handles various error cases:
- File size too large (>10MB)
- Invalid file type (non-CSV)
- Network errors
- Server errors

## Integration with Existing API

The uploaded files can be used with the existing `/api/v1/importCSV` endpoint by referencing the file path in the `csv_files/` directory.

Example:
```json
{
  "csvFilePath": "csv_files/2025-07-15T12-00-00-000Z_myfile.csv",
  "jsonFilePath": "output.json",
  "env": "coyo.staging",
  "callApi": true
}
```

## Technical Details

- **Framework**: Express.js with Multer for file uploads
- **File Validation**: MIME type and extension checking
- **Storage**: Local filesystem storage
- **Frontend**: Vanilla JavaScript with async/await for API calls
- **Styling**: Responsive CSS with modern design
