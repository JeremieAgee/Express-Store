// Import our Supabase instance
const supabase = require("../supabaseInstance");
const Snack = require("../utils/Snack");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Store {
    constructor(name) {
        this.name = name;
        /* Removed this section out of constructor

        this.snacks = [new Snack('Snack', "testSnack", 1.00, "chip", true, 10, 1)];
        this.snackCount = 0;
        this.set = false;
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY_MS = 2000;

        */
    }
    //Section above moved here and removed this keyword
    snacks = [new Snack('Snack', "testSnack", 1.00, "chip", true, 10, 1)]
    snackCount = 0;
    set = false;
    MAX_RETRIES = 3;
    RETRY_DELAY_MS = 2000;
    findSnack = (itemId) => {
        const snack = this.snacks.find(snack => snack.id === parseInt(itemId));
        if (!snack) throw new Error(`Snack with id ${itemId} not found`);
        return snack;
    }

    removeSnack = (itemId) => {
        const snackIndex = this.snacks.findIndex(snack => snack.id === parseInt(itemId));
        if (snackIndex === -1) throw new Error(`Snack with id ${itemId} not found`);
        this.snacks.splice(snackIndex, 1);
    }

    addSnack = (newItem) => {
        this.snacks.push(newItem);
        this.snackCount++;
    }

    //Function to call from db for initialization
    setStore = async () => {
        if (this.set) {
            return;
        }
        let attempts = 0;

        while (attempts < this.MAX_RETRIES && !this.set) {
            try {
                const apiSnacks = await supabase.get("/snacks");
                

                if (apiSnacks.error) {
                    throw new Error(apiSnacks.error.message || 'Failed to fetch snacks');
                }

                if (!apiSnacks.data) {
                    throw new Error('No data received from Supabase');
                }

                // Map API data to your Snack objects
                const newSnacks = apiSnacks.data.map(snack => new Snack(
                    snack.name,
                    snack.description,
                    snack.price,
                    snack.category,
                    snack.inStock,
                    snack.count,
                    snack.id
                ));

                // Update the store with new snacks
                this.snacks = newSnacks;
                this.snackCount = this.snacks.reduce((max, snack) => (snack.id > max ? snack.id : max), this.snacks[0].id) + 1;

                // Mark the store as set
                this.set = true;
                console.log("store set")
                return; 
                // Exit the function if successful
            } catch (err) {
                attempts++;
                console.log(`Attempt ${attempts} failed: ${err.message}`);

                if (attempts >= this.MAX_RETRIES) {
                    console.log(`Failed to set store after ${this.MAX_RETRIES} attempts.`);
                    throw err; 
                    // Re-throw the error after max retries
                }

                await delay(this.RETRY_DELAY_MS);
            }
        }
    }
    /*
    apiGetAllSnacks = (req, res, next) => {
        try {
            res.json(this.snacks);
        } catch (err) {
            next(err);
        }
    };

    apiGetSnackById = (req, res, next) => {
        try {
            const snack = this.findSnack(req.params.id);
            res.json(snack);
        } catch (error) {
            next(error);
        }
    }
    */
   
   //Api request functions that access the intitalized store.
    apiPostSnack = (req, res, next) => {
        try {
            // destructure our request.body object so we can store the fields in variables
            const { name, description, price, category, inStock, count } = req.body

            // error handling if request doesn't send all fields necessary
            if (!name || !description || !price || !category || inStock == null || count == null) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields!!" });
            }
            //Create snack obj to input into the store and supabase;
            const newSnack = new Snack(name, description, price, category, inStock, count, this.snackCount)
            supabase.post("/snacks", newSnack);
            this.snacks.push(newSnack)
            /* send a response of the added data.
            Note: Data is sent from the store. 
            This shows the central store on the server is updated with the db
            */
            res.status(201).json(newSnack);
        } catch (err) {
            next(err);
        }
    }

    apiPutSnack = (req, res, next) => {
        try {
            // destructure our request.body object so we can store the fields in variables
            const { name, description, price, category, inStock, count } = req.body;
            const thisId = req.params.id;


            // error handling if request doesn't send all fields necessary
            if (!name || !description || !price || !category || inStock == null || count == null) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields!!" });
            } else {
                const snack = this.findSnack(thisId);
                snack.updateSnack({ name: name, description: description, price: price, category: category, inStock: inStock, count: count });
                supabase.put("/snacks?id=eq." + thisId, snack);
                res.json(snack);
            }

        } catch (err) {
            next(err);
        }
    }

    apiDeleteSnackById = (req, res, next) => {
        try {
            //We send a delete request to supabase then remove the snack item from the store
            const thisId = req.params.id;
            supabase.delete("/snacks?id=eq." + thisId);
            res.json({ message: `The snack with id of ${thisId} has been removed` });
            this.removeSnack(thisId);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Store;