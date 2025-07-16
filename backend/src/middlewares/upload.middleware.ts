import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save to /uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

// image-only filter
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
}).array('images', 10);

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
}).single('image');

export const uploadIcon = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/svg+xml') cb(null, true);
    else cb(new Error('Only SVG files are allowed.'));
  },
}).single('icon');

export const uploadCategoryMedia = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'icon' && file.mimetype === 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type or field'));
    }
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'icon', maxCount: 1 }
]);
