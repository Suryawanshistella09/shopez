const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "cash_on_delivery"],
      default: "cash_on_delivery",
    },
    // Order Tracking Fields
    trackingNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    trackingHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        description: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-generate tracking number before saving
orderSchema.pre('save', async function() {
  if (!this.trackingNumber && this.isNew) {
    this.trackingNumber = 'TRK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
});

module.exports = mongoose.model("Order", orderSchema);