/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  company_id?: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  full_name: string;
  role: string;
}

const UserSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    full_name: { type: String },
    role: { type: String, default: "member" },
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

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
