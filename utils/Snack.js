
/*Store class that takes 5 parameters
{int} id: Id of snack
{string} name: Name of snack
{string} description
{float} price: Cost of item
{string} catagory: Catagory of the snack
{bool} inStock: Shows if item is snack
{int} count: Amount of the snack in stock
*/
class Snack {
    constructor( name='', description='', price='0.00', catagory='', inStock=false, count=0, id=0) {
        this.id = parseInt(id);
        this.name = name;
        this.description = description;
        this.price = parseFloat(price).toFixed(2);
        this.catagory = catagory;
        this.inStock = inStock;
        this.count = parseInt(count);
        
        this.updateSnack = (updatedSnack) => {
            this.name = updatedSnack.name;
            this.description = updatedSnack.description;
            this.price = parseFloat(updatedSnack.price).toFixed(2);
            this.catagory = updatedSnack.catagory;
            this.instock = updatedSnack.instock;
            this.count = parseInt(updatedSnack.count);
        }
        this.takeSome = (amount) => {
            let newCount = this.count - amount;
            if (newCount < 0) {
                throw new Error(`Can only take ${this.count}`)
            } else if (newCount == 0) {
                this.count = 0;
                this.instock = false;
            } else {
                this.count = newCount;
            }
        }
        this.addMore = (amount) => {
            if(amount<=0){
                throw new Error(`Amount can not be less than or equal to 0`)
            }
            this.count += amount;
        }
    }
}

module.exports = Snack;