const express = require("express");
const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("./knexfile");
const routes = require("./app/routes");

const app = express();
const PORT = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || "development";

const cors = require("cors");
const cookieParser = require("cookie-parser");

// Initialize knex
const knex = Knex(knexConfig[environment]);

// Bind Objection.js to knex
Model.knex(knex);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/api", routes);

// Start server
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.error("Error occurred, server can't start", error);
    }
});
