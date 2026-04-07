/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export interface IRangeBay extends Document {
  bay_name: string;
  category: string;
  description: string;
  primary_image: string;
  gallery_images: string[];
  layout_image: string;
  rules: string;
  base_price: number;
  same_day_price: number;
  minimum_booking_fee: number;
  per_person_rate: number;
  availability_rules: any;
  status: "Active" | "Inactive";
}

const RangeBaySchema = new Schema(
  {
    bay_name: { type: String, required: true },
    category: { type: String, default: "Other" }, // e.g. Cowboy, Other...
    description: { type: String },
    primary_image: { type: String },
    gallery_images: { type: [String], default: [] },
    layout_image: { type: String },
    rules: { type: String },
    base_price: { type: Number, default: 0 },
    same_day_price: { type: Number },
    minimum_booking_fee: { type: Number, default: 0 },
    per_person_rate: { type: Number, default: 0 },
    availability_rules: { type: Schema.Types.Mixed },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true, collection: "RangeBays" }
);

// Map _id to id
RangeBaySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.RangeBay || mongoose.model<IRangeBay>("RangeBay", RangeBaySchema);
