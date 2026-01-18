
Assignment 3 — CRUD API with MongoDB (Beginner Style)

This project is a simple CRUD web application built with **Node.js + Express + MongoDB (Atlas) + Mongoose**.
It was created in a beginner-friendly way and follows the assignment requirements: CRUD routes, MongoDB database (not JSON file),
validation for POST/PUT, correct HTTP status codes, and testing with Postman.

---

 Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors

---

 Features (What was implemented)
 Backend (API)
- Full CRUD for **Parking Lots**
  - Create, Read All, Read One, Update, Delete
- Data stored in **MongoDB Atlas** using **Mongoose**
- **Validation** on POST and PUT:
  - required fields, min length, min values
- **HTTP status codes**
  - `201 Created` for successful POST
  - `200 OK` for successful GET/PUT/DELETE
  - `400 Bad Request` for validation errors / invalid ID
  - `404 Not Found` if document does not exist
  - `500 Internal Server Error` for unexpected server errors

 Frontend (Simple)
- A simple page (in `/public`) to interact with the API (basic UI).

---

 Project Structure
```txt
assignment3_mongodb_crud/
  server.js
  package.json
  .env.example
  models/
  routes/
  middleware/
  public/
````

---

## Setup & Run

 1) Install dependencies

```bash
npm install
```

 2) Create `.env` file

Create a file named `.env` in the project root (same folder as `server.js`).

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/productsdb?retryWrites=true&w=majority
PORT=3000
```

> Important: Do NOT upload `.env` to GitHub (it contains secrets).

 3) Run the server

```bash
npm start
```

Server should print:

* `MongoDB connected`
* `Server running: http://localhost:3000`

Open in browser:

* [http://localhost:3000](http://localhost:3000)

---

## API Endpoints (Parking Lots)

Base URL:

```
http://localhost:3000/api/parking-lots
```

### 1) Create (POST)

**POST** `/api/parking-lots`

Body (raw JSON):

```json
{
  "name": "Aitu Parking",
  "address": "Almaty, Abay 10",
  "pricePerHour": 500,
  "totalSpots": 120,
  "hasCCTV": true
}
```

Expected result:

* `201 Created`
* returns created object with `_id`

### 2) Read All (GET)

**GET** `/api/parking-lots`

Expected result:

* `200 OK`
* returns array of parking lots

### 3) Read One (GET by id)

**GET** `/api/parking-lots/:id`

Expected result:

* `200 OK` if found
* `404 Not Found` if not found
* `400 Bad Request` if id is invalid

### 4) Update (PUT)

**PUT** `/api/parking-lots/:id`

Body (raw JSON example):

```json
{
  "name": "Aitu Parking UPDATED",
  "address": "Almaty, Abay 10",
  "pricePerHour": 700,
  "totalSpots": 120,
  "hasCCTV": false
}
```

Expected result:

* `200 OK` if updated
* `404 Not Found` if not found
* `400 Bad Request` if validation fails / invalid id

 5) Delete (DELETE)

DELETE `/api/parking-lots/:id`

Expected result:

 `200 OK` if deleted
 `404 Not Found` if not found
 `400 Bad Request` if id is invalid


Testing (Postman)

The API was tested using Postman:

1. `POST` create a parking lot → check `201`
2. `GET` all parking lots → list should contain created item
3. `GET` by id → should return the same item
4. `PUT` update by id → fields should change
5. `DELETE` by id → item should be removed
6. Negative test: send empty/invalid JSON → should return `400`



Notes

MongoDB Atlas requires IP access configuration (Network Access / IP Whitelist).
If Atlas connection fails, check your current IP in Atlas settings.