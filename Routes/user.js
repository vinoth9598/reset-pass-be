const useCrl=require('../controller/user');

const router=require('express').Router();

router.post('/signup',useCrl.signup);
router.post('/login',useCrl.login);
router.post('/forget-password',useCrl.forgetPassword);
router.post('/reset-password/:radomString/:expirationTimestamp',useCrl.resetPassword);
router.get('/getAlluser',useCrl.getAllUser);

module.exports=router;