const controllers = require("../controllers");
const authorize = require("../middleware/authorize");
const allowAccess = require("../middleware/allowAccess");
const express = require("express");
const apiRouter = express.Router();

// AUTH
apiRouter.post("/auth/login", controllers.auth.login);

/* // USER
apiRouter.get("/whoami", authorize, controllers.users.whoAmI);
apiRouter.get("/users", authorize, allowAccess([superAdmin]), controllers.users.getUsers);
apiRouter.post("/users/admin", authorize, allowAccess([superAdmin]), controllers.users.createAdmin);

// ATTENDANCE
apiRouter.get("/attendance", controllers.attendance.getAttendance);
apiRouter.get("/attendance/:id", authorize, controllers.attendance.getAttendanceById);

apiRouter.post("/attendance", authorize, allowAccess([admin, superAdmin]), controllers.attendance.addCar); */

apiRouter.use(controllers.main.onLost); //Error404
apiRouter.use(controllers.main.onError); //Error500

module.exports = apiRouter;
