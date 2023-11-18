const mongoose = require('mongoose')

const{Schema,model} = mongoose;
const USerSchema = new Schema({
    username:{type:String,required:true,min:4},
    password:{type:String,required:true}
})
const UserModel = model('user',USerSchema);
module.exports=UserModel;