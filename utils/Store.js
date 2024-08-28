class Store {
    constructor(name, beverages = [], snacks=[]) {
        this.name = name;
        this.beverages = beverages;
        this.snacks = snacks;
        this.setSnacks = (newSnacks)=>{
            this.snacks = newSnacks;
        }
        this.setBeverages = (newBeverages)=>{
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
        this.updateBeverage = (itemId, newBeverage)=>{
            this.beverages[itemId-1] = newBeverage;
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
        this.updateSnack = (itemId, newSnack)=>{
            this.snacks[itemId-1] = newSnack;
        }
    }
}
module.exports = Store;