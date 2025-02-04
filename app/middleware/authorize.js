const jwt = require("jsonwebtoken");
const { Request, Response, NextFunction } = require("express");
const { UsersModel } = require("../models/user");

async function authorize(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split("Bearer ")[1];
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await UsersModel.query()
            .findOne({ id: tokenPayload.id })
            .select("id", "email", "username", "dept_id");

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Unauthorized",
        });
    }
}

module.exports = authorize;