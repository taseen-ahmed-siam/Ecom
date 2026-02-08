import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configuration for Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type (jpeg, jpg, png, webp)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Endpoint to handle single file upload
// The frontend input name should be 'image'
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).send({ message: 'Please upload a file' });
    return;
  }
  // Return the path so frontend can use it
  res.send(`/${req.file.path}`);
});

export default router;