const { Model } = require("objection");

class User extends Model {
    static get tableName() {
        return "user";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["username", "email", "password", "dept_id"],
            properties: {
                id: { type: "integer" },
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                dept_id: { type: "integer" },
            },
        };
    }

    static get relationMappings() {
        const Department = require("./department");

        return {
            department: {
                relation: Model.BelongsToOneRelation,
                modelClass: Department,
                join: {
                    from: "user.dept_id",
                    to: "department.id",
                },
            },
        };
    }
}

module.exports = User;
