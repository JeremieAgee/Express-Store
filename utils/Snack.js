/*Store class that takes 5 parameters
{string} id: Id of snack
{string} name: Name of snack
{string} description
{string} price: Cost of item
{string} catagory: Catagory of the snack
{bool} inStock: Shows if item is snack
{string} count: Amount of the snack in stock
*/
class Snack {
    constructor(id, name, description, price, catagory, inStock, count) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = parseFloat(price).toFixed(2);
        this.catagory = catagory;
        this.inStock = inStock;
        this.count = parseInt(count);
        this.updatePrice = (newPrice) => {
            this.price = parseFloat(newPrice).toFixed(2);
        }
        this.updateStock = () => {
            this.instock = !this.instock;
        }
        this.udpateItem = (updatedItem) => {
            this.name = updatedItem.name;
            this.description = updatedItem.description;
            this.price = updatedItem.price;
            this.catagory = updatedItem.catagory;
            this.instock = updatedItem.instock;
            this.count = updatedItem.count;
        }
        this.takeSome = (amount) => {
            let newCount = this.count - amount;
            if(newCount<0){
                console.log(`Can only take ${this.count}`)
            } else if(newCount==0){
                this.count = 0;
                this.instock = false;
            } else{
                this.count = newCount;
            }
        }
        this.addMore = (amount) => {
            this.count += amount;
        }
    }
}

module.exports = Snack;