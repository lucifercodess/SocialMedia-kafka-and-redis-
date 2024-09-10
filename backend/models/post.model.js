import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  // image:{
  //   type: String,
  //   default: null
  // },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: []
  }]
}, {timestamps: true});

export const Post = mongoose.model('Post', postSchema);
