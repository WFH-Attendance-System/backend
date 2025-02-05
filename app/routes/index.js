const controllers = require("../controllers");
const authorize = require("../middleware/authorize");
const allowAccess = require("../middleware/allowAccess");
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
apiRouter.post("/users", authorize, allowAccess([constants.DEPT_IT_NAME]), controllers.users.createUser);
apiRouter.get("/users/:id", authorize, controllers.users.getUserById);
apiRouter.patch("/users/:id", authorize, controllers.users.updateUser);
apiRouter.delete("/users/:id", authorize, allowAccess([constants.DEPT_IT_NAME]), controllers.users.deleteUser);

/*
// ATTENDANCE
apiRouter.get("/attendance", controllers.attendance.getAttendance);
apiRouter.get("/attendance/:id", authorize, controllers.attendance.getAttendanceById);

apiRouter.post("/attendance", authorize, allowAccess([admin, superAdmin]), controllers.attendance.addAttendance);
*/
apiRouter.use(controllers.main.onLost); //Error404
apiRouter.use(controllers.main.onError); //Error500

module.exports = apiRouter;
