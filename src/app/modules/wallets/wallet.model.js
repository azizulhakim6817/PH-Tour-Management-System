import mongoose from "mongoose";
import { WALLET_STATUS } from "../../utils/constants.js";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 50, min: 0 },
    status: {
      type: String,
      enum: Object.values(WALLET_STATUS),
      default: WALLET_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
