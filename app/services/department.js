const department = require("../models/department");

async function findByName(name) {
    return await department.query().findOne({ name });
}

async function getAllDepartments() {
    return await departmentModel.query();
}

module.exports = {
    findByName,
    getAllDepartments,
};
