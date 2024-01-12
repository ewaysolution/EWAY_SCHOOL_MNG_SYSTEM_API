import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
    enum: ["trial", "basic", "standard", "premium"], // You can define different subscription plans
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Subscription = mongoose.model("subscription", subscriptionSchema);
export default Subscription;
