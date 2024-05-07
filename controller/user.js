const Users=require('../models/user');
const auth=require('../common/auth');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');
require('dotenv').config();

const signup = async(req,res)=>{
    try {
        let user = await Users.findOne({email:req.body.email})
        if(!user)
        {
            req.body.password = await auth.hashPassword(req.body.password)
            const newuser = await Users.create(req.body)
            res.status(201).send({
                message:`User ${req.body.userName} is Succesfully created`,
                newuser
            })
        }
       
        else{
            res.status(404).send({
                message:`user with ${req.body.email} is allready exist`
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const login=async(req,res)=>{
    try{

        let user=await Users.findOne({email:req.body.email})
        if(user){
            let hashcompare=await auth.hashcompare(req.body.password,user.password)
            if(hashcompare){
                const user = await Users.findOne({email:req.body.email},{password:0})
                res.status(201).send({
                    message:`user ${user.username} is login successfully`,
                    user
                })
            }else{
                res.status(404).send({
                    message:'Invalid password'
                })
            }
        }else{
            res.status(400).send({
                message:`User with ${req.body.email} is not found please signup`
            })
        }

    }catch(error){
        res.status(500).send({
            message:"Internal server error",
            error:error.message
        })
    }

}


const getAllUser=async (req,res)=>{
    try{
        const allUsers=await Users.find({},{password:0,_id:0})
        res.status(200).send({
            message:"users fetched successfully",
            allUsers
        })
    }catch(error){
        res.status(500).send({
            message:"Internal server error",
            error:error.mesaage
        })
    }
}

const forgetPassword = async(req,res)=>{
    try {
        let user = await Users.findOne({email:req.body.email})
        if(user)
        {
            const randomString = randomstring.generate({
                length:10,
                charset:"alphanumeric"
            })
            const expitationTimestamp = Date.now() + 2 * 60 * 1000

            console.log(expitationTimestamp)

            const resetLink = `${process.env.Reset_Url}/reset-password/${randomString}/${expitationTimestamp}`

            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL_ID,
                    pass:process.env.EMAIL_PASSWORD,

                }
            })

            const mailOptions = {
                from: process.env.EMAIL_ID,
                to : user.email,
                subject:"Password-Reset-Link",
                html:`
                <p> Dear ${user.userName} , </p>
                
                <p> Click the following Link to reset your password \n ${resetLink} </p>

                <p>If you didn’t request a login link or a password reset, you can ignore this message. </P>

                `
                
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error)
                    res.status(500).send({
                        message:"Failed to send the password reset mail"
                    })
                }
                else
                {
                    console.log("password reset email sent" + info.response)
                    res.status(201).send({
                        message:"password reset mail sent sucessfully"
                    })
                }
                user.randomString=randomString
                 user.save()
                res.status(201).send({message:"Reset password email sent successfully and random string update in db"})
            })
        }
        else
        {
            res.status(400).send({
                message:`user with ${req.body.email} is exists`
            })
        }
    } catch (error) {
        console.log (error)
        res.status(500).send({
            message:"Internel Server Error"
        })
    }
}

const resetPassword = async(req,res)=>{
    
    try {
        const {randomString,expitationTimestamp}= req.params

        const user = await Users.findOne({randomString})
        if(!user || user.randomString !== randomString)
        {
            res.status(400).send({
                message:"Invalid Random String"
            })
        }
        else
        {
            if(expitationTimestamp && expitationTimestamp<Date.now())
            {
                res.status(400).send({
                    message:"expirationTimestamp token has expired. Please request a new reset link."
                })
            } else{
                if(req.body.newPassword){
                    const newPassword = await auth.hashPassword(req.body.newPassword)

                    user.password = newPassword
                    user.randomString=null
                    await user.save()

                    res.status(201).send({
                        message:"Your new password has been updated"
                    })
                }else{
                    res.status(400).send({
                        message:"Invalid password provider"
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        message: "Internal server error",
        });
    }

}


module.exports={
    signup,
    login,
    getAllUser,
    forgetPassword,
    resetPassword
}