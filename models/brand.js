import mongoose from "mongoose";

const ShoeModelSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true, // To avoid duplicates
    },
    label: {
      type: String,
      required: true,
    },
  },
  { collection: "shoe_list" }
);

const ShoeModel =
  mongoose.models.ShoeModel || mongoose.model("ShoeModel", ShoeModelSchema);
export default ShoeModel;
