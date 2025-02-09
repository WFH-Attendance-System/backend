const userService = require("../../services/user");
const constants = require("../../utils/constants");

async function getUsers(req, res) {
    try {
        const departmentName = req.query.dept;

        const users = await userService.findAllByDepartment(departmentName);
        return res.json({
            message: "Success",
            data: users,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function getUserById(req, res) {
    try {
        if (
            req.user.dept_name == constants.DEPT_STAFF_NAME &&
            req.user.id != req.params.id
        ) {
            return res.status(403).json({
                message: "Forbidden: You don't have enough permissions",
            });
        }

        const user = await userService.findOne({ "user.id": req.params.id });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            message: "Success",
            data: user,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function createUser(req, res) {
    try {
        const user = await userService.createUser(req.body, req.user);
        return res.json({
            message: "Success",
            data: user,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function updateUser(req, res) {
    try {
        const user = await userService.findOne({ "user.id": req.params.id });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (
            req.user.dept_name == constants.DEPT_STAFF_NAME &&
            req.user.id != req.params.id
        ) {
            return res.status(403).json({
                message: "Forbidden: You don't have enough permissions",
            });
        }

        const updatedUser = await userService.updateUser(
            req.params.id,
            req.body,
            req.user
        );

        if (req.body.password || req.body.dept_id) {
            await userService.logout(req.params.id);
        }

        return res.json({
            message: "Success",
            data: updatedUser,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await userService.findOne({ "user.id": req.params.id });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await userService.deleteUser(req.params.id, req.user);
        return res.json({
            message: "Success",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e.message,
        });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
