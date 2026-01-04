# E-Commerce Backend API Testing - Search & Filter Endpoints

## Overview
This README provides complete documentation for testing the E-Commerce Backend API search and filter endpoints using Postman. It includes detailed setup instructions, API endpoint documentation, test scenarios, and a ready-to-use Postman collection.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [API Endpoints](#api-endpoints)
4. [Test Scenarios](#test-scenarios)
5. [Postman Collection](#postman-collection)
6. [cURL Examples](#curl-examples)
7. [Response Examples](#response-examples)
8. [Testing Checklist](#testing-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Java**: JDK 11 or higher
- **Maven**: 3.6+
- **Spring Boot**: 3.x
- **Postman**: v10.0 or higher (Desktop or Web version)
- **Database**: MySQL/PostgreSQL (configured in application.properties)
- **Port**: Backend running on http://localhost:8080

### Dependencies
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

---

## Setup Instructions

### 1. Backend Setup

#### Clone Repository
```bash
git clone https://github.com/Mohanraj111789/EcommerceJava.git
cd EcommerceJava/backend
```

#### Configure Database
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### Build Project
```bash
mvn clean install
```

#### Start Backend Server
```bash
mvn spring-boot:run
```

**Verify Server**: Open browser and navigate to `http://localhost:8080/api/products`

### 2. Database Setup

#### Create Database
```sql
CREATE DATABASE ecommerce;
USE ecommerce;
```

#### Run Schema
```bash
mysql -u root -p ecommerce < database/schema.sql
```

#### Insert Sample Data
```bash
mysql -u root -p ecommerce < database/sample_data.sql
```

### 3. Postman Setup

#### Import Collection
1. Open Postman
2. Click **File** → **Import**
3. Choose **Link** tab and paste: [Collection Link] OR upload JSON file
4. Click **Import**

#### Set Environment Variables
1. Click **Environments** in left sidebar
2. Create new environment named **E-Commerce-Dev**
3. Add variables:
   ```json
   {
     "baseUrl": "http://localhost:8080",
     "apiPath": "/api/products",
     "timeout": 5000
   }
   ```

---

## API Endpoints

### Base URL
```
http://localhost:8080/api/products
```

### Endpoint Summary

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/search` | Search products by keyword | ✅ |
| GET | `/category/{category}` | Filter by category | ✅ |
| GET | `/price-range` | Filter by price range | ✅ |
| GET | `/categories` | Get all categories | ✅ |
| GET | `/filter` | Combined filtering | ✅ |
| GET | `/{id}` | Get product by ID | ✅ |
| GET | `/` | Get all products | ✅ |

---

## Test Scenarios

### 1. Search Products Endpoint

#### 1.1 Search by Product Name

**Endpoint:** `GET /search?q=laptop`

**Test Name:** Search by exact/partial product name

**Request:**
```bash
GET http://localhost:8080/api/products/search?q=laptop
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance gaming laptop",
    "category": "Electronics",
    "price": 999.99,
    "stock": 5,
    "imageUrl": "laptop.jpg",
    "offerPercentage": null
  }
]
```

**Test Assertions:**
- Status Code: 200
- Response is array
- Array contains at least 1 product
- Product name contains search term
- All required fields present

**Postman Test Script:**
```javascript
pm.test("Search by name - Status 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Search results - Contains array", function () {
    pm.expect(pm.response.json()).to.be.an("array");
});

pm.test("Search results - Product name match", function () {
    let results = pm.response.json();
    pm.expect(results[0].name.toLowerCase()).to.include("laptop");
});
```

---

#### 1.2 Search by Description

**Endpoint:** `GET /search?q=gaming`

**Test Name:** Search products by keyword in description

**Request:**
```bash
GET http://localhost:8080/api/products/search?q=gaming
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance gaming laptop",
    "category": "Electronics",
    "price": 999.99,
    "stock": 5
  },
  {
    "id": 4,
    "name": "Keyboard",
    "description": "Mechanical gaming keyboard with RGB",
    "category": "Electronics",
    "price": 79.99,
    "stock": 20
  }
]
```

**Test Assertions:**
- Status Code: 200
- Array size >= 1
- All results contain "gaming" keyword

---

#### 1.3 Case-Insensitive Search

**Endpoint:** `GET /search?q=LAPTOP` (or `q=Laptop` or `q=laptop`)

**Test Name:** Verify case-insensitive search functionality

**Request:**
```bash
GET http://localhost:8080/api/products/search?q=LAPTOP
```

**Expected Response:** Same as 1.1 (all return Laptop)

**Test Assertions:**
- Case variations return identical results
- Status Code: 200

---

#### 1.4 Partial Match Search

**Endpoint:** `GET /search?q=key`

**Test Name:** Search with partial product name

**Request:**
```bash
GET http://localhost:8080/api/products/search?q=key
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 4,
    "name": "Keyboard",
    "description": "Mechanical gaming keyboard with RGB",
    "category": "Electronics",
    "price": 79.99,
    "stock": 20
  }
]
```

**Test Assertions:**
- Partial match returns correct product
- Status Code: 200

---

#### 1.5 No Results Search

**Endpoint:** `GET /search?q=nonexistent123`

**Test Name:** Search with no matching results

**Request:**
```bash
GET http://localhost:8080/api/products/search?q=nonexistent123
```

**Expected Response (200 OK):**
```json
[]
```

**Test Assertions:**
- Status Code: 200
- Returns empty array
- Response is valid JSON

---

### 2. Category Filter Endpoint

#### 2.1 Get Products by Category

**Endpoint:** `GET /category/Electronics`

**Test Name:** Filter products by specific category

**Request:**
```bash
GET http://localhost:8080/api/products/category/Electronics
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "category": "Electronics",
    "price": 999.99,
    "stock": 5
  },
  {
    "id": 2,
    "name": "Mouse",
    "category": "Electronics",
    "price": 29.99,
    "stock": 50
  },
  {
    "id": 4,
    "name": "Keyboard",
    "category": "Electronics",
    "price": 79.99,
    "stock": 20
  }
]
```

**Postman Test Script:**
```javascript
pm.test("Category filter - Status 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Category filter - All items have matching category", function () {
    let results = pm.response.json();
    results.forEach(product => {
        pm.expect(product.category).to.equal("Electronics");
    });
});
```

---

#### 2.2 Different Category

**Endpoint:** `GET /category/Clothing`

**Test Name:** Filter by Clothing category

**Expected Response:**
```json
[
  {
    "id": 3,
    "name": "T-Shirt",
    "category": "Clothing",
    "price": 19.99,
    "stock": 100
  }
]
```

---

#### 2.3 Non-Existent Category

**Endpoint:** `GET /category/NonExistent`

**Test Name:** Filter by non-existent category

**Expected Response (200 OK):**
```json
[]
```

**Test Assertions:**
- Status Code: 200
- Returns empty array (not 404)

---

### 3. Price Range Filter Endpoint

#### 3.1 Min and Max Price

**Endpoint:** `GET /price-range?minPrice=20&maxPrice=100`

**Test Name:** Filter products between price range

**Request:**
```bash
GET http://localhost:8080/api/products/price-range?minPrice=20&maxPrice=100
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "category": "Electronics"
  },
  {
    "id": 3,
    "name": "T-Shirt",
    "price": 19.99,
    "category": "Clothing"
  },
  {
    "id": 4,
    "name": "Keyboard",
    "price": 79.99,
    "category": "Electronics"
  }
]
```

**Postman Test Script:**
```javascript
pm.test("Price range - All prices within bounds", function () {
    let results = pm.response.json();
    let minPrice = 20;
    let maxPrice = 100;
    
    results.forEach(product => {
        pm.expect(product.price).to.be.at.least(minPrice);
        pm.expect(product.price).to.be.at.most(maxPrice);
    });
});
```

---

#### 3.2 Minimum Price Only

**Endpoint:** `GET /price-range?minPrice=50`

**Test Name:** Get products at minimum price or above

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99
  },
  {
    "id": 4,
    "name": "Keyboard",
    "price": 79.99
  }
]
```

---

#### 3.3 Maximum Price Only

**Endpoint:** `GET /price-range?maxPrice=30`

**Test Name:** Get products up to maximum price

**Expected Response:**
```json
[
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99
  },
  {
    "id": 3,
    "name": "T-Shirt",
    "price": 19.99
  }
]
```

---

#### 3.4 No Parameters

**Endpoint:** `GET /price-range`

**Test Name:** Price-range endpoint with no parameters

**Expected Response:** All products (same as GET /)

---

### 4. Get Categories Endpoint

#### 4.1 Get All Categories

**Endpoint:** `GET /categories`

**Test Name:** Retrieve all distinct product categories

**Request:**
```bash
GET http://localhost:8080/api/products/categories
```

**Expected Response (200 OK):**
```json
[
  "Clothing",
  "Electronics"
]
```

**Postman Test Script:**
```javascript
pm.test("Categories - Returns array of strings", function () {
    let results = pm.response.json();
    pm.expect(results).to.be.an("array");
    results.forEach(category => {
        pm.expect(category).to.be.a("string");
    });
});
```

---

### 5. Combined Filter Endpoint

#### 5.1 All Parameters

**Endpoint:** `GET /filter?category=Electronics&minPrice=20&maxPrice=100&search=gaming`

**Test Name:** Apply all filters simultaneously

**Request:**
```bash
GET http://localhost:8080/api/products/filter?category=Electronics&minPrice=20&maxPrice=100&search=gaming
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 4,
    "name": "Keyboard",
    "description": "Mechanical gaming keyboard with RGB",
    "category": "Electronics",
    "price": 79.99,
    "stock": 20
  }
]
```

**Postman Test Script:**
```javascript
pm.test("Combined filter - All conditions met", function () {
    let results = pm.response.json();
    let minPrice = 20;
    let maxPrice = 100;
    let category = "Electronics";
    let searchTerm = "gaming";
    
    results.forEach(product => {
        pm.expect(product.category).to.equal(category);
        pm.expect(product.price).to.be.at.least(minPrice);
        pm.expect(product.price).to.be.at.most(maxPrice);
        pm.expect(
            product.name.toLowerCase() + product.description.toLowerCase()
        ).to.include(searchTerm.toLowerCase());
    });
});
```

---

#### 5.2 Category and Search

**Endpoint:** `GET /filter?category=Electronics&search=keyboard`

**Expected Response:**
```json
[
  {
    "id": 4,
    "name": "Keyboard",
    "category": "Electronics",
    "price": 79.99
  }
]
```

---

#### 5.3 Price and Search

**Endpoint:** `GET /filter?minPrice=20&maxPrice=50&search=mouse`

**Expected Response:**
```json
[
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "description": "Wireless ergonomic mouse"
  }
]
```

---

#### 5.4 No Parameters

**Endpoint:** `GET /filter`

**Expected Response:** All products

---

### 6. Get Product by ID

#### 6.1 Existing Product

**Endpoint:** `GET /{id}` (e.g., `GET /1`)

**Test Name:** Get single product by valid ID

**Request:**
```bash
GET http://localhost:8080/api/products/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance gaming laptop",
  "category": "Electronics",
  "price": 999.99,
  "stock": 5,
  "imageUrl": "laptop.jpg"
}
```

---

#### 6.2 Non-Existent Product

**Endpoint:** `GET /999`

**Test Name:** Get product with invalid ID

**Expected Response (404 Not Found):**
```json
{}
```

**Postman Test Script:**
```javascript
pm.test("Product by ID - Not found returns 404", function () {
    pm.response.to.have.status(404);
});
```

---

### 7. Get All Products

#### 7.1 List All Products

**Endpoint:** `GET /`

**Test Name:** Retrieve complete product list

**Request:**
```bash
GET http://localhost:8080/api/products
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 5
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "category": "Electronics",
    "stock": 50
  },
  {
    "id": 3,
    "name": "T-Shirt",
    "price": 19.99,
    "category": "Clothing",
    "stock": 100
  },
  {
    "id": 4,
    "name": "Keyboard",
    "price": 79.99,
    "category": "Electronics",
    "stock": 20
  }
]
```

---

## Postman Collection

### Import JSON Collection

Create a file named `E-Commerce-Search-API.postman_collection.json`:

```json
{
  "info": {
    "name": "E-Commerce Search API Testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Search",
      "item": [
        {
          "name": "Search by Product Name",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/search?q=laptop",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "search"],
              "query": [{"key": "q", "value": "laptop"}]
            }
          },
          "response": []
        },
        {
          "name": "Search by Description",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/search?q=gaming",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "search"],
              "query": [{"key": "q", "value": "gaming"}]
            }
          },
          "response": []
        },
        {
          "name": "Search - No Results",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/search?q=nonexistent",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "search"],
              "query": [{"key": "q", "value": "nonexistent"}]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Category Filter",
      "item": [
        {
          "name": "Get Electronics Category",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/category/Electronics",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "category", "Electronics"]
            }
          },
          "response": []
        },
        {
          "name": "Get Clothing Category",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/category/Clothing",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "category", "Clothing"]
            }
          },
          "response": []
        },
        {
          "name": "Get Non-Existent Category",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/category/NonExistent",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "category", "NonExistent"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Price Range Filter",
      "item": [
        {
          "name": "Price Range - Min and Max",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/price-range?minPrice=20&maxPrice=100",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "price-range"],
              "query": [
                {"key": "minPrice", "value": "20"},
                {"key": "maxPrice", "value": "100"}
              ]
            }
          },
          "response": []
        },
        {
          "name": "Price Range - Min Only",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/price-range?minPrice=50",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "price-range"],
              "query": [{"key": "minPrice", "value": "50"}]
            }
          },
          "response": []
        },
        {
          "name": "Price Range - Max Only",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/price-range?maxPrice=30",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "price-range"],
              "query": [{"key": "maxPrice", "value": "30"}]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Categories",
      "item": [
        {
          "name": "Get All Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/categories",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "categories"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Combined Filter",
      "item": [
        {
          "name": "Filter - All Parameters",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/filter?category=Electronics&minPrice=20&maxPrice=100&search=gaming",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "filter"],
              "query": [
                {"key": "category", "value": "Electronics"},
                {"key": "minPrice", "value": "20"},
                {"key": "maxPrice", "value": "100"},
                {"key": "search", "value": "gaming"}
              ]
            }
          },
          "response": []
        },
        {
          "name": "Filter - Category and Search",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/filter?category=Electronics&search=keyboard",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "filter"],
              "query": [
                {"key": "category", "value": "Electronics"},
                {"key": "search", "value": "keyboard"}
              ]
            }
          },
          "response": []
        },
        {
          "name": "Filter - No Results",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/filter?category=Furniture&minPrice=500&maxPrice=1000",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "filter"],
              "query": [
                {"key": "category", "value": "Furniture"},
                {"key": "minPrice", "value": "500"},
                {"key": "maxPrice", "value": "1000"}
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Get Product by ID",
      "item": [
        {
          "name": "Get Product - Valid ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "1"]
            }
          },
          "response": []
        },
        {
          "name": "Get Product - Invalid ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products/999",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "999"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Get All Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          },
          "response": []
        }
      ]
    }
  ]
}
```

### Steps to Import:
1. Open Postman
2. Click **Import** button
3. Select **Raw Text** tab
4. Paste the JSON above
5. Click **Import**

---

## cURL Examples

### Search Endpoints

```bash
# Search by name
curl -X GET "http://localhost:8080/api/products/search?q=laptop" \
  -H "Content-Type: application/json"

# Search by description
curl -X GET "http://localhost:8080/api/products/search?q=gaming" \
  -H "Content-Type: application/json"

# Search - case insensitive
curl -X GET "http://localhost:8080/api/products/search?q=LAPTOP" \
  -H "Content-Type: application/json"
```

### Category Endpoints

```bash
# Get Electronics
curl -X GET "http://localhost:8080/api/products/category/Electronics" \
  -H "Content-Type: application/json"

# Get Clothing
curl -X GET "http://localhost:8080/api/products/category/Clothing" \
  -H "Content-Type: application/json"
```

### Price Range Endpoints

```bash
# Price range - min and max
curl -X GET "http://localhost:8080/api/products/price-range?minPrice=20&maxPrice=100" \
  -H "Content-Type: application/json"

# Price range - min only
curl -X GET "http://localhost:8080/api/products/price-range?minPrice=50" \
  -H "Content-Type: application/json"

# Price range - max only
curl -X GET "http://localhost:8080/api/products/price-range?maxPrice=30" \
  -H "Content-Type: application/json"
```

### Categories Endpoint

```bash
# Get all categories
curl -X GET "http://localhost:8080/api/products/categories" \
  -H "Content-Type: application/json"
```

### Combined Filter Endpoint

```bash
# All parameters
curl -X GET "http://localhost:8080/api/products/filter?category=Electronics&minPrice=20&maxPrice=100&search=gaming" \
  -H "Content-Type: application/json"

# Category and search
curl -X GET "http://localhost:8080/api/products/filter?category=Electronics&search=keyboard" \
  -H "Content-Type: application/json"

# Price and search
curl -X GET "http://localhost:8080/api/products/filter?minPrice=20&maxPrice=50&search=mouse" \
  -H "Content-Type: application/json"
```

### Get By ID

```bash
# Valid ID
curl -X GET "http://localhost:8080/api/products/1" \
  -H "Content-Type: application/json"

# Invalid ID
curl -X GET "http://localhost:8080/api/products/999" \
  -H "Content-Type: application/json"
```

### Get All

```bash
# All products
curl -X GET "http://localhost:8080/api/products" \
  -H "Content-Type: application/json"
```

---

## Response Examples

### Success Response Format
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance gaming laptop",
  "category": "Electronics",
  "price": 999.99,
  "stock": 5,
  "imageUrl": "laptop.jpg",
  "offerPercentage": null
}
```

### Error Response (404)
```
Status: 404 Not Found
Body: (empty or error message)
```

### Success Response (Array)
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99
  }
]
```

### Empty Array Response
```json
[]
```

---

## Testing Checklist

### Search Functionality
- [ ] Search by exact product name
- [ ] Search by partial name
- [ ] Search by description keyword
- [ ] Case-insensitive search works
- [ ] Empty search returns empty array
- [ ] Special characters handled
- [ ] No results returns 200 with empty array

### Category Filtering
- [ ] Get products in Electronics
- [ ] Get products in Clothing
- [ ] Non-existent category returns empty
- [ ] Multiple categories work independently
- [ ] Returns only specified category

### Price Range Filtering
- [ ] Min and max price filter
- [ ] Min price only filter
- [ ] Max price only filter
- [ ] No parameters returns all
- [ ] Decimal prices work correctly
- [ ] Price boundaries inclusive
- [ ] No results in range returns empty

### Combined Filtering
- [ ] All parameters together
- [ ] Category + search combination
- [ ] Category + price combination
- [ ] Price + search combination
- [ ] No parameters returns all
- [ ] Multiple filters work together

### Response Validation
- [ ] Content-Type is application/json
- [ ] Status codes correct (200, 404)
- [ ] Response structure valid
- [ ] All required fields present
- [ ] Data types correct
- [ ] No null values where unexpected

### Edge Cases
- [ ] Search with @#$ special characters
- [ ] Search with numbers
- [ ] Very long search query
- [ ] Negative prices
- [ ] Min > Max price
- [ ] Zero price
- [ ] Large ID numbers

---

## Troubleshooting

### Server Not Starting

**Error:** `Port 8080 already in use`
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Error:** `Cannot connect to database`
```bash
# Verify MySQL is running
mysql -u root -p

# Check database exists
SHOW DATABASES;

# Check connection properties in application.properties
```

### API Returns 404

**Check:**
1. Server is running on http://localhost:8080
2. URL path is correct (no typos)
3. Database has sample data
4. Product ID exists (for GET /{id})

### Search Returns No Results

**Possible Causes:**
1. Database is empty (run sample_data.sql)
2. Search term doesn't match any products
3. Database search is case-sensitive (depends on collation)

**Solution:**
```sql
-- Check database data
USE ecommerce;
SELECT * FROM product;

-- Verify search term exists
SELECT * FROM product WHERE name LIKE '%laptop%';
```

### CORS Issues in Frontend

**Add to Controller:**
```java
@CrossOrigin
@RestController
@RequestMapping("/api/products")
public class ProductController {
    // ...
}
```

### Response Takes Too Long

**Optimize:**
1. Add database indexes on searchable columns
2. Implement pagination
3. Add caching

```sql
-- Add indexes
CREATE INDEX idx_name ON product(name);
CREATE INDEX idx_category ON product(category);
CREATE INDEX idx_price ON product(price);
```

---

## Performance Tips

### Postman Collections
- Use variables to avoid hardcoding URLs
- Create pre-request scripts for setup
- Use test scripts for assertions
- Run collection multiple times for performance testing

### Database Optimization
```sql
-- Add indexes for frequently searched columns
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_product_price ON product(price);

-- View indexes
SHOW INDEX FROM product;
```

### API Response Time
- Typical: < 100ms
- Acceptable: < 500ms
- Warning: > 1000ms

---

## Contact & Support

- **GitHub**: https://github.com/Mohanraj111789/EcommerceJava
- **Issues**: Report via GitHub Issues
- **Documentation**: See README.md in backend folder

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 4, 2026 | Initial documentation |

---

## License

This project is part of the EcommerceJava application. See LICENSE file for details.

---

**Last Updated**: January 4, 2026
**Status**: ✅ Active & Maintained
