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

  itemName: { type: String, required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },

  // what kind of change: created/restocked/sold/deleted/renamed/new price
  action: {
    type: String,
    enum: ['created', 'restocked', 'sold', 'deleted', 'renamed', 'new price'],
    required: true,
  },

  // optional values for name or price changes
  oldValue: { type: String },
  newValue: { type: String },

  // reference to the product for change history
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },

  createdAt: { type: Date, default: Date.now },
});

export default model('ChangeLog', changelogSchema);
