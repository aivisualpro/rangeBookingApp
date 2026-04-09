/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  user_type: string;
  company_id?: mongoose.Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  status: string;
  last_active?: Date;
}

const UserSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: false },
    user_type: { type: String, enum: ["Internal", "External"], default: "External" },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, default: "member" },
    status: { type: String, default: "inactive" },
    last_active: { type: Date },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret.id = ret._id;
    delete ret._id;
  },
});

// Avoid caching old schemas in development Next.js HMR that cause silent missing fields
delete mongoose.models.User;
export default mongoose.model<IUser>("User", UserSchema);
