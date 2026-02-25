const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  componentName: { type: String, required: true, trim: true },
  dateSent: { type: Date, required: true, validate: { validator: v => v <= new Date(), message: 'Date sent cannot be in the future' } },
  description: { type: String, required: true, trim: true },
  repairShop: { type: String, trim: true, default: 'Internal Repair' },
  status: { type: String, enum: ['sent', 'in-progress', 'completed', 'received'], default: 'sent' },
  dateReceived: { type: Date, validate: { validator: function(v) { return !v || v >= this.dateSent; }, message: 'Date received cannot be before date sent' } },
  cost: { type: Number, min: 0, default: 0 },
  technicianAmount: { type: Number, min: 0, default: 0 },
  warrantyExpiry: { type: Date },
  notes: { type: String, trim: true, default: '' },
  // Additional fields for analytics
  labName: { type: String, trim: true },
  faultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fault' },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repairDate: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

repairSchema.virtual('repairDuration').get(function() {
  if (!this.dateReceived) return null;
  const timeDiff = this.dateReceived.getTime() - this.dateSent.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

repairSchema.index({ status: 1 });
repairSchema.index({ dateSent: -1 });
repairSchema.index({ componentName: 1 });
repairSchema.index({ labName: 1 });
repairSchema.index({ cost: 1 });

module.exports = mongoose.model('Repair', repairSchema);