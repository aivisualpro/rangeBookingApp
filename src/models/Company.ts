/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  company_name: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  billing_contact_name: string;
  billing_contact_email: string;
  billing_contact_phone: string;
  company_address: string;
  notes: string;
  status: string;
  approved_bays: any;
  booking_privileges: any;
  insurance_status: string;
  coi_expiration_date: Date;
  historical_coi_records: any;
  invite_token?: string;
  signup_url?: string;
}

const CompanySchema = new Schema(
  {
    company_name: { type: String, required: true },
    primary_contact_name: { type: String },
    primary_contact_email: { type: String },
    primary_contact_phone: { type: String },
    billing_contact_name: { type: String },
    billing_contact_email: { type: String },
    billing_contact_phone: { type: String },
    company_address: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "inactive" },
    approved_bays: { type: Schema.Types.Mixed },
    booking_privileges: { type: Schema.Types.Mixed },
    insurance_status: { type: String, default: "pending" },
    coi_expiration_date: { type: Date },
    historical_coi_records: { type: Schema.Types.Mixed },
    invite_token: { type: String, unique: true, sparse: true },
    signup_url: { type: String },
  },
  { timestamps: true }
);

// Map _id to id
CompanySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
