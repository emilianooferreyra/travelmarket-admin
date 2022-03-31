var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  shortid = require("shortid");

var postSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    title: String,
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    body: String,
    images: [
      {
        type: String,
        ref: "Image",
      },
    ],
    front: {
      type: String,
      ref: "Image",
    },
  },
  {
    timestamps: true,
  }
);

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
