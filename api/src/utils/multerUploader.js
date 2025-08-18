const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(webp)$/)) {
        req.fileValidationError = 'Only image files are allowed';
        return cb(null, false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/tmp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ 
    storage: storage, 
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
    upload
};