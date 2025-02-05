/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const constants = require("../../app/utils/constants");

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("department").del();
    await knex("department").insert([
        {
            name: constants.DEPT_IT_NAME,
            description: "Information Technology",
            created_by: 1,
            updated_by: 1,
        },
        {
            name: constants.DEPT_HRD_NAME,
            description: "Human Resource Department",
            created_by: 1,
            updated_by: 1,
        },
        {
            name: constants.DEPT_STAFF_NAME,
            description: "Other Department",
            created_by: 1,
            updated_by: 1,
        },
    ]);
};
