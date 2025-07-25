import { Router } from 'express';
import controller from '../controllers/admin.controller.js';

const router=Router();

router
    .post('/',controller.createAdmin)
    .post('/signIn',controller.signIn)
    .post('/token', controller.generateAccessToken)
    .get('/',controller.findAll)
    .get('/:id',controller.findById)
    .patch('/:id',controller.update)
    .delete('/:id',controller.delete);

export default router;