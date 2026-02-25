const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  category: { type: String, required: true, enum: ['Hardware', 'Peripherals', 'Accessories'], trim: true },
  description: { type: String, trim: true, default: '' },
  minThreshold: { type: Number, default: 5, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

inventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minThreshold;
});

inventorySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

inventorySchema.index({ category: 1 });
inventorySchema.index({ quantity: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);