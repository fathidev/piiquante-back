const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/images/",
  filename: makeFileName,
});
const upload = multer({ storage: storage });

// fabrication du nom de l'image
function makeFileName(req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname);
}

module.exports = { upload };
