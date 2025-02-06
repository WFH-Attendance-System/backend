const attendanceService = require("../../services/attendance");
const fileService = require("../../services/file");

async function getAttendances(req, res) {
    // filter by: userid, dept, user -> name
    try {
        const attendances = await attendanceService.findAll(
            req.query,
            req.user
        );
        return res.json({
            message: "Success",
            data: attendances,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function getAttendanceById(req, res) {
    try {
        const attendance = await attendanceService.findById(req.params.id);
        return res.json({
            message: "Success",
            data: attendance,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function addAttendance(req, res) {
    try {
        var { created_date } = req.body;
        if(!created_date) {
            created_date = new Date();
        } else {
            created_date = new Date(created_date);
        }

        const fileUpload = await fileService.upload(req.file, req.user, created_date);
        const attendance = await attendanceService.addAttendance(
            req.user.id,
            created_date,
            fileUpload
        );
        return res.json({
            message: "Success",
            data: attendance,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

module.exports = {
    getAttendances,
    getAttendanceById,
    addAttendance,
};
