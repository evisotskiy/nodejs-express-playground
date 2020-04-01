const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');

const imgDir = path.join(path.dirname(process.mainModule.filename), 'images');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    mkdirp(imgDir, () => cb(null, imgDir));
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '_') + '-' + file.originalname);
  },
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter });
