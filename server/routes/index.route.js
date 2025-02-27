import { Router } from "express";


import authHandler from './auth.route.js'

const router = Router();

router.use(authHandler);

export default router