/*Store class that takes 5 parameters
{string} id: Id of Beverage
{string} name: Name of beverage
{string} description
{string} price: Cost of item
{string} catagory: Catagory of the beverage
{bool} inStock: Shows if item is available
{string} count: Amount of the beverage in stock
*/
class Beverage {
    constructor(id, name, description, price, catagory, inStock, count) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = parseFloat(price).toFixed(2);
        this.catagory = catagory;
        this.inStock = inStock;
        this.count = parseInt(count);
    }
}

module.exports = Beverage;