const multer = require('multer');
const path = require('path');

// Define the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the folder where files will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define the filename using the original name and a timestamp to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
}).single('image'); // 'image' is the field name in the form for the uploaded file

module.exports = upload;
