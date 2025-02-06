const { Model } = require("objection");

class Attendance extends Model {
    static get tableName() {
        return "attendance";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["user_id"],
            properties: {
                id: { type: "integer" },
                user_id: { type: "integer" },
                check_in_time: { type: "string", format: "date-time" },
                check_out_time: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        const User = require("./user");
        return {
            user: {
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
