import mongoose, { Schema, Document } from "mongoose";

export interface IBookingAuditLog {
  action: string;
  timestamp: Date;
  user_id?: mongoose.Types.ObjectId | string;
  details?: string;
}

export interface IBooking extends Document {
  reference_id: string; // Human readable booking ID (e.g., BKG-1029)
  company_id: mongoose.Types.ObjectId | string;
  company_name_snapshot: string;
  requesting_user_id: mongoose.Types.ObjectId | string;
  requesting_user_name_snapshot: string;
  bay_id: mongoose.Types.ObjectId | string;
  bay_name_snapshot: string;
  linked_bay_ids?: mongoose.Types.ObjectId[] | string[];
  booking_date: string; // Format: YYYY-MM-DD
  start_time: string; // Format: "14:00"
  end_time: string; // Format: "16:00"
  time_zone: string;
  expected_attendee_count: number;
  price_per_person_snapshot: number;
  minimum_booking_fee_snapshot: number;
  base_price_snapshot: number;
  same_day_discount_applied: boolean;
  total_quoted_price: number;
  customer_notes?: string;
  internal_admin_notes?: string;
  status: "Pending" | "Approved" | "Denied" | "Cancelled" | "Completed";
  submitted_at: Date;
  reviewed_by_user_id?: mongoose.Types.ObjectId | string;
  reviewed_at?: Date;
  audit_log: IBookingAuditLog[];
  // inherited via timestamps feature
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema(
  {
    reference_id: { type: String, required: true, unique: true },
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    company_name_snapshot: { type: String, required: true },
    requesting_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requesting_user_name_snapshot: { type: String, required: true },
    bay_id: { type: Schema.Types.ObjectId, ref: "RangeBay", required: true },
    bay_name_snapshot: { type: String, required: true },
    linked_bay_ids: [{ type: Schema.Types.ObjectId, ref: "RangeBay" }],
    
    booking_date: { type: String, required: true }, // Simple ISO YYYY-MM-DD
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    time_zone: { type: String, default: "America/Los_Angeles" },
    
    expected_attendee_count: { type: Number, default: 0 },
    
    // Financial Snapshots to prevent past bookings from magically changing price if bay price is updated later
    price_per_person_snapshot: { type: Number, default: 0 },
    minimum_booking_fee_snapshot: { type: Number, default: 0 },
    base_price_snapshot: { type: Number, default: 0 },
    same_day_discount_applied: { type: Boolean, default: false },
    total_quoted_price: { type: Number, default: 0 },
    
    customer_notes: { type: String },
    internal_admin_notes: { type: String },
    
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied", "Cancelled", "Completed"],
      default: "Pending",
    },
    
    submitted_at: { type: Date, default: Date.now },
    reviewed_by_user_id: { type: Schema.Types.ObjectId, ref: "User" },
    reviewed_at: { type: Date },
    
    audit_log: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Map _id to id securely without affecting raw DB structure
BookingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret: Record<string, any>) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
