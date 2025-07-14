import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

import { uploadImage } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/', uploadImage, createProduct);
router.patch('/:id', uploadImage, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
