const multer = require("multer");

const storage = multer.memoryStorage();

const multerMemory = multer({ storage });
module.exports = multerMemory;