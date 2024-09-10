// Import our Supabase instance
const supabase = require("../supabaseInstance");
const Snack = require("../utils/Snack");
const Beverage = require("../utils/Beverage");
class Store {
    constructor(name, beverages = [], snacks = []) {
        this.name = name;
        this.beverages = beverages;
        this.snacks = snacks;
        this.set = false;
        this.setSnacks = (newSnacks) => {
            this.snacks = newSnacks;
        }
        this.setBeverages = (newBeverages) => {
            this.beverages = newBeverages
        }
        this.findBeverage = (itemId) => {
            const found = this.beverages[parseInt(itemId) - 1];
            return found
        }
        this.findSnack = (itemId) => {
            const found = this.snacks[parseInt(itemId) - 1];
            return found
        }
        this.updateBeverage = (itemId, newBeverage) => {
            this.beverages[itemId - 1] = newBeverage;
        }
        this.removeBeverage = (itemId) => {
            this.beverages.splice(parseInt(itemId) - 1, 1);
            this.beverages.forEach((item, index) => {
                item.id = index + 1;
            })
        }
        this.addBeverage = (newItem) => {
            newItem.id = this.beverages.length + 1;
            this.beverages.push(newItem);
        }
        this.removeSnack = (itemId) => {
            this.beverages.splice(parseInt(itemId) - 1, 1);
            this.beverages.forEach((item, index) => {
                item.id = index + 1;
            })
        }
        this.addSnack = (newItem) => {
            newItem.id = this.beverages.length + 1;
            this.beverages.push(newItem);
        }
        this.updateSnack = (itemId, newSnack) => {
            this.snacks[itemId - 1] = newSnack;
        }
        this.setStore = async function setStore() {
            if (this.set === false) {
                this.set = true;
                try {
                    //Get snacks table from db and set the store's snacks.
                    const snacks = await supabase.get("/snacks");
                    const newSnacks = snacks.data.map((snack) => {
                        return new Snack(snack.id, snack.name, snack.description, snack.price, snack.catagory, snack.inStock, snack.count)
                    })
                    this.setSnacks(newSnacks);

                    //Get beverages table from db and set the store's beverages.
                    const beverages = await supabase.get("/beverages");
                    const newBeverages = beverages.data.map((beverage) => {
                        return new Beverage(beverage.id, beverage.name, beverage.description, beverage.price, beverage.catagory, beverage.inStock, beverage.count)
                    })
                    this.setBeverages(newBeverages);
                    console.log(`Store set with database`);

                } catch (err) {
                    console.log(`Error loading database${err}`);
                }
            }
        }

        this.apiGetAllSnacks = async (req, res, next) => {
            try {
                res.json(this.snacks);
            } catch (err) {
                next(err);
            }
        }
        this.apiGetSnackById = (req, res, next) => {
            try {
                res.json(this.findSnack(req.params.id));
            } catch (error) {
                next(error);
            }
        }
        this.apiPostSnack = (req, res, next) => {
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
                    const newSnack = new Snack(this.snacks.length + 1, name, description, price, catagory, inStock, count)
                    supabase.post("/snacks", newSnack);
                    this.snacks.push(newSnack)
                }
                /* send a response of the added data.
                Note: Data is sent from the store. 
                This shows the central store on the server is updated with the db
                */
                res.status(201).json(this.snacks[this.snacks.length]);
            } catch (err) {
                next(err);
            }
        }
        this.apiPutSnack = (req, res, next) => {
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
                    this.updateSnack(thisId, updatedSnack);
                }
                res.json(this.findSnack(thisId));
            } catch (err) {
                next(err);
            }
        }
        this.setStore();
        this.apiDeleteSnackById = (req, res, next) => {
            try {

                //We send a delete request to supabase then remove the snack item from the store
                const thisId = req.params.id;
                supabase.delete("/snacks?id=eq." + thisId);
                res.json({ message: `The snack with ${thisId} has been removed` });
                this.removeSnack(thisId);
            } catch (err) {
                next(err)
            }
        }
    }
}
module.exports = Store;