const auth = (request, response, next) => {
  const apiKey = request.headers['api-key'];

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return response.status(403).json({
      message: "ACCESS DENIED! You need an API key for that. Please contact the administrators.",
    });
  }
  next();
};

module.exports = auth;