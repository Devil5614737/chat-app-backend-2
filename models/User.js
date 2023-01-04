const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuoiVnnWu_QbtFist_W7Hbz2V4drhwXDVyiw&usqp=CAU"
    }
})

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id}, process.env.PRIVATE_KEY);
    return token;
}

const User=mongoose.model("User",userSchema)

module.exports=User