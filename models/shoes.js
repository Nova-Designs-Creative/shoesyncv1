import mongoose from "mongoose";

const SneakerSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: String,
      enum: ["AVAIL", "SOLD", "OUT_OF_STOCK"], // Enforcing specific values for availability
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dateSold: {
      type: Date,
      default: null,
    },
    priceSold: {
      type: Number,
      default: null,
    },
    soldTo: {
      type: String,
      default: null,
    },
    soldBy: {
      type: String,
      default: null,
    },
    profit: {
      type: Number,
      default: null,
    },
    commissions: {
      fitz: {
        type: Number,
        default: 0,
      },
      bryan: {
        type: Number,
        default: 0,
      },
      ashley: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true, collection: "shoe_inventory" }
);

const Sneaker =
  mongoose.models.Sneaker || mongoose.model("Sneaker", SneakerSchema);
export default Sneaker;
