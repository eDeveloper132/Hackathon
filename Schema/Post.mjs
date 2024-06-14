import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Post = new Schema({
  ResponseId: { type: String || Number, required: true},
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: Number, required: true},
  createdAt: { type: Date, required: true, default: Date.now }
});
const PostModel = model("Hackathon", Post);
export default PostModel;