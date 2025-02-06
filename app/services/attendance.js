const constants = require("../utils/constants");
const attendanceModel = require("../models/attendance");

async function findAll(params, user) {
    // filter by userid, departement name, user name (employee name)
    const { userId, dept, name } = params;
    const query = attendanceModel.query().joinRelated("[user.department]");

    if (userId) {
        query.findAll({ "user.id": userId });
    }

    if (dept) {
        query.findAll({ "department.name": dept });
    }

    if (name) {
        query.whereRaw('UPPER("user"."name") LIKE ?', [
            `%${name.toUpperCase()}%`,
        ]);
    }

    // Only select their own data
    if (user.dept_name == constants.DEPT_STAFF_NAME) {
        query.findAll({ "user.id": user.id });
    }

    return await query;
}

async function findById(id) {
    return await attendanceModel.query().findById(id);
}

async function addAttendance(userId, datetime, path) {
    const dateObject = new Date(datetime).toISOString();

    // Check if there is any attendance data with the same user_id and check_in_time
    const checkin = await attendanceModel
        .query()
        .whereRaw("DATE(check_in_time) = ?", [dateObject.split("T")[0]])
        .andWhere("user_id", userId)
        .first();

    // if checkin is found and checkout data is found, then return error
    if (checkin && checkin.check_out_time) {
        throw new Error("Attendance data already exists");
    }

    if (!checkin) {
        // If not found, insert new attendance data
        return await attendanceModel.query().insert({
            user_id: userId,
            check_in_time: dateObject,
            check_in_photo: path,
            created_at: new Date(),
            updated_at: new Date(),
        });
    } else {
        // If found, update check_out_time and photo
        return await attendanceModel.query().patchAndFetchById(checkin.id, {
            check_out_time: dateObject,
            check_out_photo: path,
            updated_at: new Date(),
        });
    }
}


module.exports = {
    findAll,
    findById,
    addAttendance,
};
