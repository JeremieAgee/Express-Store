// Import Dotenv
require("dotenv").config();

// Import Express
const express = require("express");

// Import CORS
const cors = require("cors");

// Import our Supabase instance
const supabase = require("./supabaseInstance");

// create an express application
const app = express();

/*Import Util Classes
These classes help maintain project structure.
They also store all the data from the database without a constant connection
*/
const Store = require("./utils/Store");
const Beverage = require("./utils/Beverage");
const Snack = require("./utils/Snack");
// Intitalize the shop class
const onlineShop = new Store(`Jeremie's Store`);

//Create function to set the store with data in the db before server initialization
async function setStore() {
  try {

    //Get snacks table from db and set the store's snacks.
    const snacks = await supabase.get("/snacks");
    const newSnacks = snacks.data.map((snack) => {
      return new Snack(snack.id, snack.name, snack.description, snack.price, snack.catagory, snack.inStock, snack.count)
    })
    onlineShop.setSnacks(newSnacks);

    //Get beverages table from db and set the store's beverages.
    const beverages = await supabase.get("/beverages");
    const newBeverages = beverages.data.map((beverage) => {
      return new Beverage(beverage.id, beverage.name, beverage.description, beverage.price, beverage.catagory, beverage.inStock, beverage.count)
    })
    onlineShop.setBeverages(newBeverages);
    console.log(`Store set with database`);
  } catch (err) {
    console.log(`Error loading database${err}`);
  }
}

// Call the function to set store.
setStore();

// define a port
const PORT = 4000;

// Define our Middleware
// Use CORS Middleware
app.use(cors());

// Use JSON middleware to parse request bodies
app.use(express.json());

// Define our Routes
// Home Route
app.get("/", (req, res, next) => {
  res.json({ Welcome: "All!" });
});

// Route to Get all Snacks
app.get("/snacks", async (req, res, next) => {
  try {

    /*Note: Instead of making a supabase request for the snacks table 
    each time we return the set snacks from the store.
    */
   res.json(onlineShop.snacks);
  } catch (err) {
    next(err);
  }
});

// Route to get a single snack
app.get("/snacks/:id", (req, res, next) => {
  try {
    res.json(onlineShop.findSnack(req.params.id));
  } catch (error) {
    next(error);
  }
});

// Route to add a snack
app.post("/snacks", (req, res, next) => {
  try {
    // destructure our request.body object so we can store the fields in variables
    const { name, description, price, catagory, inStock, count } = req.body

    // error handling if request doesn't send all fields necessary
    if (!name || !description || !price || !catagory) {
      console.log(req.body)
      return res
        .status(400)
        .json({ message: "Missing required fields!!" });
    } else {
      //Create snack obj to input into the store and supabase;
      const newSnack = new Snack(onlineShop.snacks.length + 1, name, description, price, catagory, inStock, count)
      supabase.post("/snacks", newSnack);
      onlineShop.snacks.push(newSnack)
    }
    /* send a response of the added data.
    Note: Data is sent from the store. 
    This shows the central store on the server is updated with the db
    */
    res.status(201).json(onlineStore.snacks[onlineStore.snacks.length]);
  } catch (err) {
    next(err);
  }
});

// Route to update a snack
app.put("/snacks/:id", (req, res, next) => {
  try {

    // destructure our request.body object so we can store the fields in variables
    const { name, description, price, catagory, inStock, count } = req.body;
    const thisId = req.params.id;
    const updatedSnack = new Snack(thisId, name, description, price, catagory, inStock, count);

    // error handling if request doesn't send all fields necessary
    if (!name || !description || !price || !catagory || !inStock || !count) {
      return res
        .status(400)
        .json({ message: "Missing required fields!!" });
    } else {
      supabase.put("/snacks?id=eq." + thisId, updatedSnack);
      onlineShop.updateSnack(thisId, updatedSnack);
    }
    res.json(onlineShop.findSnack(thisId));
  } catch (err) {
    next(err);
  }
});

//Route to remove Snack
app.delete("/snacks/:id", (req, res, next) => {
  try {

    //We send a delete request to supabase then remove the snack item from the store
    const thisId = req.params.id;
    supabase.delete("/snacks?id=eq." + thisId);
    res.json({ message: `The snack with ${thisId}` });
    onlineShop.removeSnack(thisId);
  } catch (err) {
    next(err)
  }
});

// Error Handling
// Generic Error Handling
app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).json({
    error: "Something broke!",
    errorStack: error.stack,
    errorMessage: error.message,
  });
});

// 404 Resource not found Error Handling
app.use((request, response, next) => {
  response.status(404).json({
    error:
      "Resource not found. Try again or try different spot",
  });
});

// make the server listen on our port
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});