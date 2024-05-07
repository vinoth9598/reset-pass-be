const express=require('express');
require('dotenv').config();
const mongoose=require('mongoose');
const cors=require('cors');

const PORT=process.env.PORT
const app=express();

const AppRouter=require('./Routes/index')

// middleware
app.use(cors());
app.use(express.json());

app.use('/',AppRouter);

console.log(`${process.env.dbURL}`);
try{
    mongoose.connect(`${process.env.dbUrl}`);
    console.log("mongoose connected");
}catch(error){
    console.log("error :",error)
}


app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
});




