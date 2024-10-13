import mongoose from "mongoose";

const studentModel= new mongoose.Schema({
    reg:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },

})
export default mongoose.model("students",studentModel)