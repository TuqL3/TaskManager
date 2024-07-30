import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureUploadDirectoryExists = () => {
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     ensureUploadDirectoryExists();
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//     // cb(null, file.fieldname + '-' + Date.now())
//   }
// });

// const upload = multer({ storage: storage });

export default upload;
