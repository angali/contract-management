import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema(
  {
    contractId: {
      type: Number,
      default: 0,
      required: true,
      index : true
    },
    name: {
      type: String,
      enum: ["ContractCreatedEvent", "ContractTerminatedEvent"],
      default: "ContractCreatedEvent",
      required: true,
      index : true
    },
    premium: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    terminationDate: {
      type: Date,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventsSchema);
