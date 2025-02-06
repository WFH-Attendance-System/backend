const fs = require("fs");
const path = require("path");
const constants = require("../utils/constants");

const UPLOAD_DIR = constants.UPLOAD_DIR;
async function upload(file, user, created_date) {
    const allowedTypes = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png",
    }

    created_date = new Date(created_date);
    try {
        if (!file) {
            throw new Error("File is required");
        }

        if (!allowedTypes[file.mimetype]) {
            throw new Error("Invalid file type");
        }

        const fileExtension = allowedTypes[file.mimetype];

        // change date format to: YYYY-MM-DDTHH:MM:SS
        const date = created_date.toISOString().replace(/[^0-9]/g, '').slice(0, -3);

        const filename = `${date}_${user.dept_name}_${user.name}.${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        // Create the upload directory if it doesn't exist
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, file.buffer);
        return filename;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    upload,
};
