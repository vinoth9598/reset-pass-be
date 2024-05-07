const mongoose= require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    randomString:{
        type:String
       
    }
   
})



const Users=mongoose.model('Users',userSchema,'users')

module.exports=Users;