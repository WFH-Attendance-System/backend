const express = require('express');

function allowAccess(allowedDept) {
    return (req, res, next) => {
        if (!allowedDept.includes(req.user.dept_id)) {
            return res.status(403).json({
                message: "Forbidden: You don't have enough permissions"
            });
        }
        next();
    };
}

module.exports = allowAccess;