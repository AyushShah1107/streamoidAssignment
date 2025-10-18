# streamoidAssignment

# Product Management API

This API is designed to manage products, allowing users to upload data via CSV, retrieve products, and search for products based on various filters such as brand, category, price range, etc.

## Table of Contents

- Features
- Technologies
- API Documentation
  - 1. Get Products
  - 2. Search Products
  - 3. Upload Products Data
- Setup and Installation
  - 1. Clone the Repository
  - 2. Environment Setup
  - 3. Install Dependencies
  - 4. Run the Application
- Testing
  - 1. Unit Testing
  - 2. API Testing

---

## Features

- **Get Products**: Retrieve all products from the database.
- **Search Products**: Filter products based on various query parameters (brand, color, category, price, etc.).
- **Upload Products Data**: Upload products via CSV files.

---

## Technologies

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **CSV Parsing**: `csv-parser`
- **Environment Management**: dotenv
- **CORS**: `cors` to handle cross-origin requests

---

## API Documentation

### 1. Get Products

**Endpoint**: `GET /api/v1/products`

Retrieve a list of all products in the database.

#### Sample Request

```bash
GET /api/v1/products
```
#### Response

```json
{
  "message": "got data",
  "data": [
    {
      "sku": 123,
      "Name": "Product 1",
      "Description": "This is product 1",
      "Brand": "Brand A",
      "Category": "Category X",
      "Price": 100,
      "Currency": "USD",
      "Stock": 10,
      "EAN": "123456789",
      "Color": "Red",
      "Size": "M",
      "Availability": "in_stock",
      "InternalID": "ABC123"
    }
  ]
}
```

### 2. Search Products

**Endpoint:** `GET /api/v1/products/search`

**Description:** Search for products with filters.

**Query Parameters:**

- `brand` (optional) — Brand name
- `color` (optional) — Color of product
- `category` (optional) — Category name
- `minPrice` (optional) — Minimum price (number)
- `maxPrice` (optional) — Maximum price (number)

### Request Example

```http
GET /api/v1/products/search?brand=Brand%20A&minPrice=50&maxPrice=200
```

### Response (200 OK)

```json
[
  {
    "sku": 123,
    "Name": "Product 1",
    "Description": "This is product 1",
    "Brand": "Brand A",
    "Category": "Category X",
    "Price": 100,
    "Currency": "USD",
    "Stock": 10,
    "EAN": "123456789",
    "Color": "Red",
    "Size": "M",
    "Availability": "in_stock",
    "InternalID": "ABC123"
  }
]
```
### 3. Upload Products Data

**Endpoint:** `POST /api/v1/upload`

**Description:** Upload product details CSV file.

**Content-Type:** `multipart/form-data`

**Form Field:**

- `file` (CSV file)

#### Sample CSV Format

```csv
Name,Price,Index,Brand,Category,Stock,Color,Size,Availability
Product 1,100,123,Brand A,Category X,10,Red,M,in_stock
Product 2,150,124,Brand B,Category Y,5,Blue,L,out_of_stock
```

#### Request Example (curl)

```bash
curl -X POST http://localhost:4000/api/v1/upload -F "file=@/path/to/products.csv"
```

#### Response (200 OK)

```json
{
  "message": "CSV processed successfully!",
  "totalRows": 2,
  "savedCount": 2,
  "missingCount": 0,
  "missingRows": []
}
```

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/product-management-api.git
cd product-management-api
```

Replace your-username and repo name accordingly.

### Environment Setup

Create a `.env` file in the root directory with the following content:

```env
MONGO_URI=mongodb://localhost:27017/your-db-name
PORT=4000
```
- Replace your-db-name with your MongoDB database name.
- Ensure MongoDB server is running locally or use a hosted MongoDB service.

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

Server will be running on http://localhost:4000

## Testing

### Unit Testing

You can add unit tests using Jest or Mocha (not included by default).

Run tests with:

```bash
npm test
```

## API Testing

Use tools like Postman or cURL.

### Example cURL commands:

**Get all products:**

```bash
curl -X GET http://localhost:4000/api/v1/products
```

### Search Products

- **Endpoint:** `GET /api/v1/products/search`
- **Description:** Search for products with filters such as brand, color, category, and price range.

#### Example cURL Request

```bash
curl -X GET "http://localhost:4000/api/v1/products/search?brand=Brand%20A&minPrice=50&maxPrice=200"
```

### Upload Products Data

- **Endpoint:** `POST /api/v1/upload`
- **Description:** Upload a CSV file containing product data.
- **Content-Type:** `multipart/form-data`
- **Form Field:** `file` (the CSV file)

#### Example cURL Request

```bash
curl -X POST http://localhost:4000/api/v1/upload -F "file=@/path/to/products.csv"
```

## Notes

- CSV upload expects mandatory fields: `Name`, `Price`, and `Index`.
- Invalid rows in CSV (missing required fields) will be reported and skipped.
- Uploaded CSV files are deleted after processing.
- CORS enabled for cross-origin requests.











