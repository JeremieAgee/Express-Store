const notFound = (request, response, next) => {
    response.status(404).json({
        error:
            "Resource not found. Try again or try different spot",
    });
}
module.exports = notFound;