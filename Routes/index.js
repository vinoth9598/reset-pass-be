const express=require('express')

const UserRouter=require('./user');

const router = express.Router()
router.get("/", (req, res) => {
    res.status(200).send(` <h1> Welcome to our Password Reset backend</h1>`);
  });
router.use('/user',UserRouter)

module.exports=router;