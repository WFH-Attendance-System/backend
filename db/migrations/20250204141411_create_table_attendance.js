/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("attendance", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.dateTime("check_in_time").notNullable();
        table.string("check_in_photo").notNullable();
        table.dateTime("check_out_time").nullable();
        table.string("check_out_photo").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("attendance");
};
