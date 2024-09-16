// Import our Supabase instance
const supabase = require("../supabaseInstance");
const Snack = require("../utils/Snack");

class Store {
    constructor(name) {
        this.name = name;
        this.snacks = [new Snack('Snack', "testSnack", 1.00, "chip", true, 10, 1)];
        this.snackCount = 0;
        this.set = false;
        this.MAX_RETRIES = 5;
        this.RETRY_DELAY_MS = 2000;
        this.findSnack = (itemId) => {
            const snack = this.snacks.find(snack => snack.id === parseInt(itemId));
            if (!snack) throw new Error(`Snack with id ${itemId} not found`);
            return snack;
        }
        this.removeSnack = (itemId) => {
            const snackIndex = this.snacks.findIndex(snack => snack.id === parseInt(itemId));
            if (snackIndex === -1) throw new Error(`Snack with id ${itemId} not found`);
            this.snacks.splice(snackIndex, 1);
        }

        this.addSnack = (newItem) => {
            this.snacks.push(newItem);
            this.snackCount++;
        }
    
        this.setStore = async () => {
            if (this.set) {
                return;
            }
            let attempts = 0;

            while (attempts < this.MAX_RETRIES) {
                try {
                    const apiSnacks = await supabase.get("/snacks");
                    const newSnacks = apiSnacks.data.map(snack => new Snack(
                        snack.name,
                        snack.description,
                        snack.price,
                        snack.catagory,
                        snack.inStock,
                        snack.count,
                        snack.id));
                    this.snacks = newSnacks;
                    this.snackCount = this.snacks.length > 0 ? this.snacks[this.snacks.length - 1].id + 1 : 1;
                    this.set = true;
                    return; // Exit the function if successful
                } catch (err) {
                    attempts++;
                    console.log(`Attempt ${attempts} failed: ${err.message}`);
                    if (attempts >= this.MAX_RETRIES) {
                        console.log(`Failed to set store after ${this.MAX_RETRIES} attempts.`);
                        throw err; // Re-throw the error after max retries
                    }
                    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY_MS)); // Delay before retrying
                }
            }
        };
        this.apiGetAllSnacks = async (req, res, next) => {
            try {
                res.json(this.snacks);
            } catch (err) {
                next(err);
            }
        }
        this.apiGetSnackById = (req, res, next) => {
            try {
                const snack = this.findSnack(req.params.id);
                res.json(snack);
            } catch (error) {
                next(error);
            }
        }
        this.apiPostSnack = (req, res, next) => {
            try {
                // destructure our request.body object so we can store the fields in variables
                const { name, description, price, catagory, inStock, count } = req.body

                // error handling if request doesn't send all fields necessary
                if (!name || !description || !price || !catagory || inStock==null || count==null) {
                    return res
                        .status(400)
                        .json({ message: "Missing required fields!!" });
                }
                //Create snack obj to input into the store and supabase;
                const newSnack = new Snack( name, description, price, catagory, inStock, count, this.snackCount)
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
        this.apiPutSnack = (req, res, next) => {
            try {
                // destructure our request.body object so we can store the fields in variables
                const { name, description, price, catagory, inStock, count } = req.body;
                const thisId = req.params.id;


                // error handling if request doesn't send all fields necessary
                if (!name || !description || !price || !catagory || inStock==null || count==null) {
                    return res
                        .status(400)
                        .json({ message: "Missing required fields!!" });
                } else {
                    const snack = this.findSnack(thisId);
                    snack.updateSnack({ name: name, description: description , price: price, catagory: catagory, inStock: inStock, count:count });
                    supabase.put("/snacks?id=eq." + thisId, snack);
                    res.json(snack);
                }
                
            } catch (err) {
                next(err);
            }
        }
        
        this.apiDeleteSnackById = (req, res, next) => {
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
        this.setStore();
    }
}
module.exports = Store;