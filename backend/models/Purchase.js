import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Snapshot of the location the buyer agreed to when reserving.
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["reserved", "cancelled", "completed", "expired"],
      default: "reserved",
      required: true,
    },
    // Store a one-way hash, never the code sent to the buyer.
    verificationCodeHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // TODO: Add chat reference and cancellation/expiry timestamps when those workflows need direct linkage or audit history.
  },
);

const Purchase = mongoose.model("Purchase", PurchaseSchema);
export default Purchase;
