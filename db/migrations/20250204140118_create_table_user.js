/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("user", (table) => {
        table.increments("id").primary();
        table.string("name", 50).notNullable();
        table.string("username", 50).notNullable();
        table.string("password").notNullable();
        table.integer("dept_id").notNullable();
        table.string("email", 100).notNullable();
        table.string("phone_number", 30).notNullable();
        table.boolean("is_active").defaultTo(true);
        table.integer("created_by").notNullable();
        table.integer("updated_by").notNullable();
        table.integer("deleted_by").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.dateTime("deleted_at").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user");
};
