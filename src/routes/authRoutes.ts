import express from 'express';

import * as authController from '../controllers/authControllerv1';

const router = express.Router();

router.route('/signup').post(authController.signup);

export default router;
