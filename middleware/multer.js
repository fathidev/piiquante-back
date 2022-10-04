const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: makeFileName,
});
const upload = multer({ storage: storage });

// fabrication du nom de l'image
function makeFileName(req, file, cb) {
  const extension = file.originalname.split(".").at(-1);
  if( extension != "jpg" && extension != "jpeg" && extension != "png" && extension != "gif" ) {
    return cb(new Error("image format not valid"), null);
  }
    cb(null, Date.now() + "-" + file.originalname);
}

module.exports = { upload };
