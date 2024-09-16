const genericError = (error, request, response, next) => {
    console.error(error.stack);
    response.status(500).json({
        error: "Something didn't work!",
        errorStack: error.stack,
        errorMessage: error.message,
    });
}
module.exports = genericError;