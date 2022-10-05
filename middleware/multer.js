const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: makeFileName,
});
const upload = multer({ storage: storage });

// fabrication du nom de l'image
function makeFileName(req, file, cb) {
  const extension = file.originalname.split(".").at(-1);
  const isImageValid = ["jpg", "jpeg", "png"].includes(extension);
  if (isImageValid) return cb(null, Date.now() + "-" + file.originalname);
  cb(new Error("file isn't an image format valid"), null);
}

module.exports = { upload };
