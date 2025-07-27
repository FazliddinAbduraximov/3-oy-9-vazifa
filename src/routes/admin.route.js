import { Router } from 'express';
import controller from '../controllers/admin.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/role.guard.js';
import { validate } from '../middlewares/validate.js';
import adminValidator from '../validation/AdminValidation.js'
import { requestLimiter } from '../utils/request-limit.js';

const router=Router();

router
    .post('/',AuthGuard, RolesGuard('SUPPERADMIN'),validate(adminValidator.create),controller.createAdmin)
    .post('/signIn',requestLimiter(60,10),validate(adminValidator.signIn),controller.signIn)
    .post('/token', controller.generateAccessToken)
    .post('/signout',AuthGuard,controller.signOut)
    .get('/',AuthGuard, RolesGuard('SUPPERADMIN'), controller.findAll)
    .get('/:id',AuthGuard, RolesGuard('SUPPERADMIN','ID'),controller.findById)
    .patch('/password/:id',AuthGuard, RolesGuard('SUPPERADMIN','ID'),validate(adminValidator.password),controller.updataPasswordForAdmin)
    .patch('/:id',AuthGuard, RolesGuard('SUPPERADMIN','ID'),validate(adminValidator.update),controller.updateAdmin)
    .delete('/:id',AuthGuard, RolesGuard('SUPPERADMIN'),controller.delete);

export default router;