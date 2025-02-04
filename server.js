const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const PORT = 3000;

// connect to db
knex(knexConfig);


app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);