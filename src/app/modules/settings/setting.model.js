import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    cashInFeePercent: { type: Number, default: 0 },
    cashOutFeePercent: { type: Number, default: 1.5 },
    transferFeePercent: { type: Number, default: 0.5 },
    agentCommissionPercent: { type: Number, default: 0.5 },
  },
  { timestamps: true }
);
export const Settings = mongoose.model("Settings", settingsSchema);
