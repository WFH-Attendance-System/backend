const constants = require("../utils/constants");
const attendanceModel = require("../models/attendance");

async function findAll(params, user) {
    // filter by userid, departement name, user name (employee name), latest = true/false
    const { userId, dept, name, latest, date } = params;
    const query = attendanceModel
        .query()
        .joinRelated("user.department")
        .select(
            "attendance.id",
            "user.name as employee_name",
            "user:department.name as department_name",
            "check_in_time",
            "check_out_time",
            "check_in_photo",
            "check_out_photo"
        );

    if (userId) {
        query.where({ "user.id": userId });
    }

    if (dept) {
        query.where({ "user:department.name": dept });
    }

    if (name) {
        query.whereRaw("UPPER(user.name) LIKE ?", [`%${name.toUpperCase()}%`]);
    }

    if (latest) {
        query.orderBy("attendance.id", "desc");
    }

    if (date) {
        query.whereRaw("DATE(check_in_time) = ?", [date]);
    }

    // Only select their own data
    if (user.dept_name == constants.DEPT_STAFF_NAME) {
        query.where("user.id", user.id);
    }

    return await query;
}

async function findById(id, user) {
    const query = attendanceModel
        .query()
        .joinRelated("user.department")
        .select(
            "attendance.id",
            "user.name as employee_name",
            "user:department.name as department_name",
            "check_in_time",
            "check_out_time",
            "check_in_photo",
            "check_out_photo"
        )
        .where("attendance.id", id);

    if (user.dept_name == constants.DEPT_STAFF_NAME) {
        query.andWhere("user.id", user.id);
    }

    return await query;
}

async function addAttendance(userId, datetime, path) {
    const dateObject = new Date(datetime).toISOString();

    // datetime not today & not this month
    if (
        datetime.getDate() != new Date().getDate() &&
        datetime.getMonth() != new Date().getMonth()
    ) {
        throw new Error("Photo must be taken today");
    }

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

    if (checkin && new Date(checkin.check_in_time) >= new Date(dateObject)) {
        throw new Error("Check Out time can't be earlier than Check In time");
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
