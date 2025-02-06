const jwt = require("jsonwebtoken");
const userService = require("../services/user");
const userModel = require("../models/user");

async function authorize(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split("Bearer ")[1];
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await userService.findOne(tokenPayload.id, [
            "user.id",
            "email",
            "user.name as name",
            "username",
            "dept_id",
            "department.name as dept_name",
        ]);

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}

module.exports = authorize;
