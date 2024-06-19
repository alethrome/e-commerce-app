const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storageConfig = multer.diskStorage({
    destination: path.join(__dirname, '../', 'uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storageConfig
});

const uploadsDir = path.join(__dirname, '../', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
};

module.exports = { upload };