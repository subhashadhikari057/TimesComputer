import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { uploadImages } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);

router.get('/:id', getProductById);
router.post('/', uploadImages, createProduct);
router.patch('/:id', uploadImages, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
