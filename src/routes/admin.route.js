import { Router } from 'express';
import controller from '../controllers/admin.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/role.guard.js';
import { validate } from '../middlewares/validate.js';
import adminValidator from '../validation/AdminValidation.js'
import { requestLimiter } from '../utils/request-limit.js';
import { Roles } from '../const/index.js';

const router=Router();

router
    .post('/',AuthGuard, RolesGuard(Roles.SUPPERADMIN),validate(adminValidator.create),controller.createAdmin)
    .post('/signIn',requestLimiter(60,10),validate(adminValidator.signIn),controller.signIn)
    .post('/token', controller.generateAccessToken)
    .post('/signout',AuthGuard,controller.signOut)
    .get('/',AuthGuard, RolesGuard(Roles.SUPPERADMIN), controller.findAll)
    .get('/:id',AuthGuard, RolesGuard(Roles.SUPPERADMIN,'ID'),controller.findById)
    .patch('/password/:id',AuthGuard, RolesGuard(Roles.SUPPERADMIN,'ID'),validate(adminValidator.password),controller.updataPasswordForAdmin)
    .patch('/forget-password',validate(adminValidator.forgetPassword),controller.forgetPassword)
    .patch('/confirm-otp',validate(adminValidator.confirmOTP),controller.confirmOTP)
    .patch('/confirm-password',validate(adminValidator.confirmPassword),controller.confirmPassword)
    .patch('/:id',AuthGuard, RolesGuard(Roles.SUPPERADMIN,'ID'),validate(adminValidator.update),controller.updateAdmin)
    .delete('/:id',AuthGuard, RolesGuard(Roles.SUPPERADMIN),controller.delete);

export default router;