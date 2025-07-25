import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  incrementProductView,
  importProductsFromCSV,
} from '../controllers/product.controller';
import { uploadImages, uploadCSV } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.post('/view/:slug', incrementProductView);
router.post('/import-csv', uploadCSV, importProductsFromCSV);

router.get('/:id', getProductById);
router.post('/', uploadImages, createProduct);
router.patch('/:id', uploadImages, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
