const multer = require('multer');
const path = require("path");

const storageEngine = multer.diskStorage({
    destination:  function (req, file, cb) {
        cb(null, 'public/uploads')
  },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ext)
    }
  });

  const upload = multer({
    storage: storageEngine
  });


module.exports = upload;