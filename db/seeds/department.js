/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("department").del();
    await knex("department").insert([
        {
            name: "IT",
            description: "Information Technology",
            created_by: 1,
            updated_by: 1,
        },
        {
            name: "HRD",
            description: "Human Resource Department",
            created_by: 1,
            updated_by: 1,
        },
        {
            name: "Staff",
            description: "Other Department",
            created_by: 1,
            updated_by: 1,
        },
    ]);
};
