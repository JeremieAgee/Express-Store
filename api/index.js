// Import Dotenv
require("dotenv").config();

// Import Express
const express = require("express");

// Import CORS
const cors = require("cors");

// Import Axios
const axios = require("axios");

// import our Supabase instance
const supabase = require("../supabaseInstance");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
// create an express application
const app = express();

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
// Use CORS Middleware
app.use(cors(corsOptions))

// Use JSON middleware to parse request bodies
app.use(express.json());

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

// make the server listen on our port
const server=app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
module.exports = { app, server };