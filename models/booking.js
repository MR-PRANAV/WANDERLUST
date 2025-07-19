const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  people: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } }, // <--- TTL index here
  paymentId: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('Booking', bookingSchema);