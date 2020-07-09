const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    licensePlate:{
        type:String,
        default:''
    },
    avata: {
        data: Buffer,
        contentType: String 
    }
    ,
    motoImage:{
        type:String,
        default:''
    },
    activated:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});
UserSchema.methods.generateHash=(password)=>{
    console.log("genera")
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    // return bcrypt.hashSync(password,bcrypt.generateHash(8),null);
}
UserSchema.methods.validPassword = (password,user) =>{
    console.log("here")
    console.log(password);
    console.log(user.password)
    return bcrypt.compareSync(password, user.password);
};
module.exports = mongoose.model('UserDB', UserSchema);
