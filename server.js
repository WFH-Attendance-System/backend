const express = require("express");
const knex = require("knex");
const knexConfig = require("./knexfile");
const routes = require("./app/routes");

const app = express();
const PORT = 3000;
const environment = process.env.NODE_ENV || "development";

// connect to db
knex(knexConfig[environment]);
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, (error) => {
    if (!error)
        console.log(
            "Server is Successfully Running, and App is listening on port " +
                PORT
        );
    else console.log("Error occurred, server can't start", error);
});
