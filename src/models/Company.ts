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
  is_active: boolean;
  approved_bays: any;
  booking_privileges: any;
  insurance_status: string;
  coi_expiration_date: Date;
  historical_coi_records: any;
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
    is_active: { type: Boolean, default: true },
    approved_bays: { type: Schema.Types.Mixed },
    booking_privileges: { type: Schema.Types.Mixed },
    insurance_status: { type: String, default: "pending" },
    coi_expiration_date: { type: Date },
    historical_coi_records: { type: Schema.Types.Mixed },
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
