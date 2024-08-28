// Import Dotenv
require("dotenv").config();

// Import Express
const express = require("express");

// Import CORS
const cors = require("cors");

// Import Axios
const axios = require("axios");

// import our Supabase instance
const supabase = require("./supabaseInstance");

// create an express application
const app = express();

const Store = require("./utils/Store");
const Beverage = require("./utils/Beverage");
const Snack = require("./utils/Snack");
const onlineShop = new Store(`Jeremie's Store`);
// define a port
const PORT = 4000;
async function setStore(){
    try{
    const snacks = await supabase.get("/snacks");
    const newSnacks = snacks.data.map((snack)=>{
        return new Snack(snack.id, snack.name, snack.description, snack.price, snack.catagory, snack.inStock, snack.count)
    })
    onlineShop.setSnacks(newSnacks);
    const beverages = await supabase.get("/beverages");
    const newBeverages = beverages.data.map((beverage)=>{
        return new Beverage(beverage.id, beverage.name, beverage.description, beverage.price, beverage.catagory, beverage.inStock, beverage.count)
    })
    onlineShop.setBeverages(newBeverages);
    console.log(`Store set with database`);
    }catch(err){
        console.log(`Error loading database${err}`);
    }
}
setStore();
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
    const {name, description, price, catagory, inStock, count} = req.body

    // error handling if request doesn't send all fields necessary
    if (!name || !description || !price || !catagory) {
        console.log(req.body)
      return res
        .status(400)
        .json({ message: "Missing required fields!!" });
    } else {
        const newSnack = new Snack(onlineShop.snacks.length+1, name, description, price, catagory, inStock , count)
        supabase.post("/snacks", newSnack);
        onlineShop.snacks.push(newSnack)
    }
    // send a response of the added data
    res.status(201).json(onlineStore.snacks[onlineStore.snacks.length]);
  } catch (err) {
    next(err);
  }
});

// Route to update a beverage
app.put("/snacks/:id", (req, res, next) => {
    try {
        // destructure our request.body object so we can store the fields in variables
        const {name, description, price, catagory, inStock, count} = req.body
        const thisId = req.params.id;
        const updatedSnack = new Snack(thisId, name, description, price, catagory, inStock, count)
        // error handling if request doesn't send all fields necessary
        if (!name || !description || !price || !catagory || !inStock || !count) {
          return res
            .status(400)
            .json({ message: "Missing required fields!!" });
        } else {
            supabase.put("/snacks?id=eq."+thisId, updatedSnack);
            onlineShop.updateSnack(thisId, updatedSnack);
        }
        res.json(onlineShop.findSnack(thisId));
      } catch (err) {
        next(err);
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
      "Resource not found. Are you sure you're looking in the right place?",
  });
});

// make the server listen on our port
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});