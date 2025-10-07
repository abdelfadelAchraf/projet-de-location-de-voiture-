
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  dropoffLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  pricing: {
    dailyRate: {
      type: Number,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    insurance: {
      type: Number,
      default: 0,
    },
    addons: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  addons: [{
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  insuranceType: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'none'],
    default: 'basic',
  },
  promoCode: {
    code: String,
    discount: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'],
    default: 'pending',
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  actualPickupTime: Date,
  actualDropoffTime: Date,
  mileageStart: Number,
  mileageEnd: Number,
  fuelLevelStart: {
    type: String,
    enum: ['empty', 'quarter', 'half', 'three-quarters', 'full'],
  },
  fuelLevelEnd: {
    type: String,
    enum: ['empty', 'quarter', 'half', 'three-quarters', 'full'],
  },
  inspectionNotes: {
    pickup: String,
    dropoff: String,
  },
  damageReport: [{
    description: String,
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'severe'],
    },
    cost: Number,
    images: [String],
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  additionalCharges: [{
    description: String,
    amount: Number,
    reason: String,
  }],
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
  },
  notes: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ car: 1, status: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

// Generate booking number before save
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK${Date.now()}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Calculate total days
bookingSchema.virtual('totalDays').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Check if booking is active
bookingSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' || 
         (this.status === 'confirmed' && this.startDate <= now && this.endDate >= now);
};

// Calculate refund amount based on cancellation policy
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const daysUntilStart = Math.ceil((this.startDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilStart >= 7) {
    return this.pricing.total * 0.9; // 90% refund
  } else if (daysUntilStart >= 3) {
    return this.pricing.total * 0.5; // 50% refund
  } else if (daysUntilStart >= 1) {
    return this.pricing.total * 0.25; // 25% refund
  }
  return 0; // No refund
};

export default mongoose.model('Booking', bookingSchema);