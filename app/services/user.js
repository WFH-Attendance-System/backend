const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { encryptPassword } = require("../utils/encryption");

async function createUser(body, user) {
    const { name, phone_number, username, email, password, dept_id } = body;
    const encryptedPassword = await encryptPassword(password);
    if (
        !name ||
        !phone_number ||
        !username ||
        !email ||
        !password ||
        !dept_id
    ) {
        throw new Error("Semua kolom belum terisi");
    }

    return await userModel.query().insert({
        name,
        phone_number,
        username,
        email,
        password: encryptedPassword,
        dept_id,
        created_by: user.id,
        updated_by: user.id,
    });
}

async function findOne(id, columns = null) {
    const model = userModel
        .query()
        .joinRelated("department")
        .findOne({ "user.id": id });

    if (columns) {
        model.select(columns);
    }

    return await model;
}

async function findByEmail(email) {
    return await userModel.query().findOne({ email });
}

async function findAllByDepartment(departmentName = null) {
    const query = userModel
        .query()
        .joinRelated("department")
        .select(
            "user.id",
            "user.email",
            "user.name",
            "user.phone_number",
            "user.is_active",
            "department.name as department_name"
        );

    if (departmentName) {
        query.whereRaw("LOWER(department.name) = ?", [
            departmentName.toLowerCase(),
        ]);
    }

    return await query;
}

async function updateUser(userId, body, userUpdating) {
    if (body.password) {
        body.password = await encryptPassword(body.password);
    }

    return await userModel.query().patchAndFetchById(userId, {
        ...body,
        updated_by: userUpdating.id,
        updated_at: new Date().toISOString(),
    });
}

async function deleteUser(userId, userDeleting) {
    return await userModel.query().patchAndFetchById(userId, {
        refresh_token: null,
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by: userDeleting.id,
    });
}

async function checkPassword(hash, password) {
    return await bcrypt.compare(password, hash);
}

async function createRefreshToken(userId, refreshToken) {
    return await userModel
        .query()
        .findById(userId)
        .patch({ refresh_token: refreshToken });
}

async function logout(userId) {
    return await userModel
        .query()
        .findById(userId)
        .patch({ refresh_token: null });
}

module.exports = {
    createUser,
    findOne,
    findByEmail,
    findAllByDepartment,
    updateUser,
    deleteUser,
    checkPassword,
    createRefreshToken,
    logout,
};
