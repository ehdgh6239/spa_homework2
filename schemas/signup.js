const mongoose = require("mongoose");

const singupSchema = new mongoose.Schema({
  nickname:{ 
    type : String,
    require: true
  },
  password:{
    type: String,
    require: true    
  },
  confirm :{
    type : String,
    require: true
  }
},
  {versionKey: false }
);

module.exports = mongoose.model("signup", singupSchema);