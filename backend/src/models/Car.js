import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 2010,
    max: new Date().getFullYear() + 1,
  },
  category: {
    type: String,
    required: true,
    enum: ['economy', 'compact', 'midsize', 'standard', 'fullsize', 'suv', 'luxury', 'van', 'convertible', 'sports'],
  },
  transmission: {
    type: String,
    required: true,
    enum: ['automatic', 'manual'],
    default: 'automatic',
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 2,
    max: 15,
  },
  doors: {
    type: Number,
    required: true,
    min: 2,
    max: 5,
  },
  color: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  vin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  mileage: {
    type: Number,
    required: true,
    default: 0,
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  features: [{
    type: String,
    enum: [
      'gps', 'bluetooth', 'backup_camera', 'sunroof', 'leather_seats',
      'heated_seats', 'air_conditioning', 'cruise_control', 'usb_ports',
      'apple_carplay', 'android_auto', 'parking_sensors', 'keyless_entry',
    ],
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
  },
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    notes: String,
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'unavailable'],
    default: 'available',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  specifications: {
    engineCapacity: String,
    horsepower: Number,
    luggage: Number, // in liters
    fuelConsumption: String, // e.g., "7.5L/100km"
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
carSchema.index({ category: 1, status: 1 });
carSchema.index({ location: 1, status: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ 'rating.average': -1 });

// Virtual for reviews
carSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'car',
});

// Virtual for bookings
carSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'car',
});

// Method to check availability for specific dates
carSchema.methods.isAvailableForDates = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  
  const conflictingBooking = await Booking.findOne({
    car: this._id,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  return !conflictingBooking;
};

// Static method to find available cars
carSchema.statics.findAvailable = function(startDate, endDate, filters = {}) {
  return this.aggregate([
    {
      $match: {
        status: 'available',
        isActive: true,
        ...filters,
      },
    },
    {
      $lookup: {
        from: 'bookings',
        let: { carId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$car', '$$carId'] },
              status: { $in: ['confirmed', 'active'] },
              $or: [
                {
                  startDate: { $lte: new Date(endDate) },
                  endDate: { $gte: new Date(startDate) },
                },
              ],
            },
          },
        ],
        as: 'conflictingBookings',
      },
    },
    {
      $match: {
        conflictingBookings: { $size: 0 },
      },
    },
    {
      $project: {
        conflictingBookings: 0,
      },
    },
  ]);
};

export default mongoose.model('Car', carSchema);