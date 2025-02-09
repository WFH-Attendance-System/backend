const jwt = require("jsonwebtoken");
const userService = require("../services/user");

async function authorize(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split("Bearer ")[1];
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await userService.findOne({ "user.id": tokenPayload.id }, [
            "user.id",
            "email",
            "user.name as name",
            "username",
            "dept_id",
            "department.name as dept_name",
            "refresh_token",
            "is_active"
        ]);

        if(!req.user.is_active) {
            throw new Error("User is not active");
        }

        if (!req.user.refresh_token) {
            throw new Error("Unauthorized");
        }

        next();
    } catch (err) {
        console.log(err);
        res.clearCookie("refresh_token");
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}

module.exports = authorize;
