// Import Dotenv
require("dotenv").config();

// Import Express
const express = require("express");

// Import CORS
const cors = require("cors");

const corsOptions = {
  origin: process.env.EXPRESS_STORE_CLIENT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, SmartTVs) choke on 204
};

// Create an Express application
const app = express();

app.use(express.json());
// Use CORS Middleware
app.use(cors(corsOptions));

// Import Utility Classes
const Store = require("../utils/Store");

// Import Middleware
const genericError = require('./middleware/genericError');
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');
const checkAndSetStore = require("./middleware/checkAndSetStore");

// Initialize the shop class
const onlineShop = new Store(`Jeremie's Store`);

// Define the port
const PORT = 4000;

app.use(checkAndSetStore(onlineShop))

// Define Routes
app.get("/", (req, res) => {
  //Send store as json obj for frontend to have the data of the store with less api calls
  res.json(`Welcome to my Store ${onlineShop.name}`);
});

app.get("/store", (req, res) => {
  //Send store as json obj for frontend to have the data of the store with less api calls
  res.json(onlineShop);
});

// Apply auth middleware only to protected routes
app.use(auth);

/*
No longer Needed with base fetch  sending the store object

Route to get all Snacks
app.get("/snacks", onlineShop.apiGetAllSnacks);

Route to get a single snack
app.get("/snacks/:id", onlineShop.apiGetSnackById);
*/

// Route to add a snack (protected)
app.post("/snacks", onlineShop.apiPostSnack);

// Route to update a snack (protected)
app.put("/snacks/:id", onlineShop.apiPutSnack);

// Route to remove a snack (protected)
app.delete("/snacks/:id", onlineShop.apiDeleteSnackById);

// Error Handling Middleware
app.use(genericError); // Generic error handler
app.use(notFound); // 404 handler for routes not found

// Start server and ensure store is set
app.listen(PORT, async () => {
  await onlineShop.setStore()
  console.log(`The server is running on http://localhost:${PORT}`);
});

module.exports = app;