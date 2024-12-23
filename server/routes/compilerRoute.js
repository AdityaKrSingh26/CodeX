import express from 'express';
import { 
    compileCode, 
} from '../controllers/compilerController.js';

const router = express.Router();

router.get('/', compileCode);

export default router;