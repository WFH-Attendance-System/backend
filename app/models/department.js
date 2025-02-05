const { Model } = require("objection");

class Department extends Model {
    static get tableName() {
        return "department";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                id: { type: "integer" },
                name: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const User = require("./user");

        return {
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "department.id",
                    to: "user.dept_id",
                },
            },
        };
    }
}

module.exports = Department;
