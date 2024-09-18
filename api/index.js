// Import Dotenv
require("dotenv").config();

// Import Express
const express = require("express");

// Import CORS
const cors = require("cors");

const corsOptions = {
  origin: process.env.EXPRESS_STORE_CLIENT,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// create an express application
const app = express();

app.use(express.json());
// Use CORS Middleware
app.use(cors(corsOptions))

/*Import Util Classes
These classes help maintain project structure.
They also store all the data from the database without a constant connection
*/
const Store = require("../utils/Store");

const genericError = require('./middleware/genericError');
const notFound = require('./middleware/notFound');
const auth = require('./middleware/auth');

// Intitalize the shop class
const onlineShop = new Store(`Jeremie's Store`);
onlineShop.setStore();

// define a port
const PORT = 4000;

// Define our Middleware

// Use JSON middleware to parse request bodies


app.use(auth)

// Define our Routes
// Home Route
app.get("/", (req, res, next) => {
  res.send(`Welcome world`)
});

// Route to Get all Snacks
app.get("/snacks", onlineShop.apiGetAllSnacks);

// Route to get a single snack
app.get("/snacks/:id", onlineShop.apiGetSnackById);

// Route to add a snack
app.post("/snacks", onlineShop.apiPostSnack);

// Route to update a snack
app.put("/snacks/:id", onlineShop.apiPutSnack);

//Route to remove Snack
app.delete("/snacks/:id", onlineShop.apiDeleteSnackById);

// Error Handling
// Generic Error Handling
app.use(genericError);

// 404 Resource not found Error Handling
app.use(notFound);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`); 
});

module.exports = app;
