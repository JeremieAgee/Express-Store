const checkAndSetStore = (onlineShop) => {
    return async (req, res, next) => {
        try {
            //Check if Store is set.
            if (!onlineShop.set) {
                await onlineShop.setStore();
            }
            next();
        } catch (err) {
            console.error("Failed to set the store", err);
            return res.status(500).json({ message: "Failed to load the store data" });
        }
    };
};

module.exports = checkAndSetStore; // Ensure this is present