const controllers = require("../controllers");
const authorize = require("../middleware/authorize");
const allowAccess = require("../middleware/allowAccess");
const multerMemory = require("../middleware/multermemory");

const express = require("express");
const apiRouter = express.Router();

const constants = require("../utils/constants");
apiRouter.get("/", function(req, res){
    return res.send("Hello World");
})

// AUTH
apiRouter.post("/auth/login", controllers.auth.login);
apiRouter.post("/auth/logout", authorize, controllers.auth.logout);
apiRouter.get("/auth/whoami", authorize, controllers.auth.whoAmI);

// USER
apiRouter.get("/users", authorize, allowAccess([constants.DEPT_IT_NAME, constants.DEPT_HRD_NAME]), controllers.users.getUsers);
apiRouter.post("/users", authorize, allowAccess([constants.DEPT_IT_NAME, constants.DEPT_HRD_NAME]), controllers.users.createUser);
apiRouter.get("/users/:id", authorize, controllers.users.getUserById);
apiRouter.patch("/users/:id", authorize, controllers.users.updateUser);
apiRouter.delete("/users/:id", authorize, allowAccess([constants.DEPT_IT_NAME, constants.DEPT_HRD_NAME]), controllers.users.deleteUser);

// ATTENDANCE
apiRouter.get("/attendances", authorize, controllers.attendances.getAttendances);
apiRouter.get("/attendances/:id", authorize, controllers.attendances.getAttendanceById);

apiRouter.post("/attendance", authorize, multerMemory.single("photo"), controllers.attendances.addAttendance);

module.exports = apiRouter;
