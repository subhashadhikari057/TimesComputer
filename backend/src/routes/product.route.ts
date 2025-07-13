import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/get', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/get/:id', getProductById);
router.post('/add', upload, createProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);


export default router;
