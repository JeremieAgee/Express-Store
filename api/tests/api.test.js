// Import Dotenv
require("dotenv").config();
process.env.NODE_ENV = 'development';
const request = require("supertest");
const { app, server } = require("../index");


describe("Snacks API", () => {
  // Test GET all snacks
 
  it("should return all snacks", async () => {
    const response = await request(app)
      .get("/snacks")
      .set("api-key", process.env.ADMIN_API_KEY);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  //!name || !description || !price || !catagory || !inStock || !count
  // Test POST a new snack
  it("should add a new snack", async () => {

    const newSnack = {
      name: "Potato Chips",
      description: "Crispy and salty chips",
      price: 2.5,
      catagory: "Chips",
      inStock: true,
      count: 10, 
      id: 100
    };
    const response = await request(app)
      .post("/snacks")
      .set("api-key", process.env.ADMIN_API_KEY)
      .send(newSnack)
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Potato Chips");
    expect(response.body).toHaveProperty("description", "Crispy and salty chips");
    expect(response.body).toHaveProperty("price", "2.50");
  });
  // Test GET a single snack by ID
  it("should return a snack by ID", async () => {

    const snackId = 1;
    const response = await request(app)
      .get(`/snacks/${snackId}`)
      .set("api-key", process.env.ADMIN_API_KEY);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", snackId);
  });


  // Test PUT to update a snack by ID
  it("should update a snack by ID", async () => {

    const snackId = 1; // Use a valid ID
    const updatedSnack = {
      name: "BBQ Chips",
      description: "Smoky and spicy chips",
      price: 2.75,
      catagory: "Chips",
      inStock: true,
      count: 20,
    };
    const response = await request(app)
      .put(`/snacks/${snackId}`)
      .set("api-key", process.env.ADMIN_API_KEY)
      .send(updatedSnack)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "BBQ Chips");
    expect(response.body).toHaveProperty("description", "Smoky and spicy chips");
    expect(response.body).toHaveProperty("price", "2.75");
  });

  // Test DELETE a snack by ID
  it("should delete a snack by ID", async () => {

    const snackId = 0; // Change this ID for testing purposes
    const response = await request(app)
      .delete(`/snacks/${snackId}`)
      .set("api-key", process.env.ADMIN_API_KEY);
    expect(response.status).toBe(200);
  });

  // Close the server after all tests
  afterAll((done) => {
    server.close(done); // Ensure server is closed after tests
  });
});