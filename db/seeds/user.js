/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcrypt");
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("user").del();
    await knex("user").insert([
        {
            username: "admin",
            password: bcrypt.hashSync("admin", 10),
            name: "Admin",
            email: "admin@gmail.com",
            phone_number: "08123456789",
            dept_id: 1,
            created_by: 1,
            updated_by: 1,
        },
        {
            username: "hrd",
            password: bcrypt.hashSync("hrd", 10),
            name: "HRD",
            email: "hrd@gmail.com",
            phone_number: "08123456789",
            dept_id: 2,
            created_by: 1,
            updated_by: 1,
        },
    ]);
};
