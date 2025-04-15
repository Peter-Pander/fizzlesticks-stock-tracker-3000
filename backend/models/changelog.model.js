import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const changelogSchema = new Schema({
  itemName: { type: String, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('ChangeLog', changelogSchema);
