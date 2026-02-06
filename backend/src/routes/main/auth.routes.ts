import bokachodaa from 'express'

 import magicLinkRouter from '../auth/magic.link.routes'
 import googleAuthRouter from '../auth/google.auth.routes'
 
import logoutRouter from '../auth/logout.route'
import tokenRouter from '../auth/token.routes'
const router = bokachodaa.Router();

router.use(magicLinkRouter);
router.use(googleAuthRouter);
router.use(logoutRouter)
router.use(tokenRouter)

export default router