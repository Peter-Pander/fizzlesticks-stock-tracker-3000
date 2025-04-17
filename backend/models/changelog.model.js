// models/changelog.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const changelogSchema = new Schema({
  // associate each log entry with the creating user
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  itemName:  { type: String, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('ChangeLog', changelogSchema);
