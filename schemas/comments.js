const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    commentId: {
      type: Number,
      required: true,
      unique: true
    },
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    nickname: {
      type: String,
      require: true
    },
    comment: {
      type: String,
      require: true
    }
  },
  {timestamps: true,versionKey: false }
);

module.exports = mongoose.model("Comments", commentsSchema);