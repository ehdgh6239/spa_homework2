const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  title:{
    type : String,
    require: true
  },
  content :{
    type : String,
    require: true
  },
  likes:{
    type : String
  }
},
  {timestamps: true,versionKey: false }
);
postSchema.virtual("post_Id").get(function () {
  return this._id.toHexString();
});
postSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Post", postSchema);