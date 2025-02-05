const { Model } = require("objection");

class Attendance extends Model {
    static get tableName() {
        return "attendance";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                id: { type: "integer" },
                user_id: { type: "integer" },
                check_in_time: { type: "datetime" },
            },
        };
    }

    static get relationMappings() {
        const User = require("./user");

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "attendance.id",
                    to: "user.id",
                },
            },
        };
    }
}

module.exports = Attendance;
