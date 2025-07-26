import { Router } from 'express';
import controller from '../controllers/admin.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/role.guard.js';
import { validate } from '../middlewares/validate.js';
import adminValidator from '../validation/AdminValidation.js'

const router=Router();

router
    .post('/',AuthGuard, RolesGuard('SUPPERADMIN'),validate(adminValidator.create),controller.createAdmin)
    .post('/signIn',validate(adminValidator.signIn),controller.signIn)
    .post('/token', controller.generateAccessToken)
    .post('/signout',AuthGuard,controller.signOut)
    .get('/',AuthGuard, RolesGuard('SUPPERADMIN'), controller.findAll)
    .get('/:id',AuthGuard, RolesGuard('SUPPERADMIN','ID'),controller.findById)
    .patch('/:id',controller.update)
    .delete('/:id',AuthGuard, RolesGuard('SUPPERADMIN'),controller.delete);

export default router;